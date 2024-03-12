/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { Decimal } from "@prisma/client/runtime/library";
import { updateUserSettings } from "@/app/actions/user";
import { getSessionOrFail } from "@/app/actions/util";
import { createFormDataFromObject } from "@/util/formdata";

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: "test@example.com" } })),
}));
jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test@examples.com" }, session: {} })),
}));
jest.mock("next/navigation");

describe("updateUserSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have an auth guard", async () => {
    const formData = createFormDataFromObject({ basePrice: 60, showInlineDayCalendarInMobileView: true });
    await updateUserSettings(formData);
    expect(getSessionOrFail).toHaveBeenCalledTimes(1);
  });

  it("should create the user settings with the provided form data if the user settings had not existed", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    const mockSession = { user: mockUser };
    // @ts-ignore
    getSessionOrFail.mockResolvedValue({ session: mockSession, user: mockUser });

    const formData = createFormDataFromObject({ basePrice: 60, showInlineDayCalendarInMobileView: true });
    const res = await updateUserSettings(formData);

    expect(prismaMock.userSettings.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledWith({
      data: {
        basePrice: 60,
        showInlineDayCalendarInMobileView: "true",
      },
    });
    expect(res).toEqual({ success: true });
  });

  it("should update the user settings with the provided form data if the user settings had existed", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    const mockSession = { user: mockUser };
    // @ts-ignore
    getSessionOrFail.mockResolvedValue({ session: mockSession, user: mockUser });
    // @ts-ignore
    prismaMock.userSettings.findFirst.mockResolvedValue({
      userEmail: mockUser.email,
      basePrice: new Decimal(50),
      showInlineDayCalendarInMobileView: false,
    });

    const formData = createFormDataFromObject({ basePrice: 60, showInlineDayCalendarInMobileView: true });
    const res = await updateUserSettings(formData);

    expect(prismaMock.userSettings.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledTimes(0);
    expect(prismaMock.userSettings.update).toHaveBeenCalledWith({
      where: { userEmail: mockUser.email },
      data: {
        basePrice: 60,
        showInlineDayCalendarInMobileView: "true",
      },
    });
    expect(res).toEqual({ success: true });
  });
});
