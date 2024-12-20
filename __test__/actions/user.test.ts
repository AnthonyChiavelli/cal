/**
 * @jest-environment node
 */
import { getUserSettings, updateUserSettings } from "../../src/app/actions/user";
import { getSessionOrFail } from "../../src/app/actions/util";
import { prismaMock } from "../../src/singleton";
import { createFormDataFromObject } from "../../src/util/formdata";
import { TEST_USER_EMAIL } from "../constants";
import { UserSettings } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL } })),
}));
jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
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
    const mockUser = { id: 1, email: TEST_USER_EMAIL };
    const mockSession = { user: mockUser };
    // @ts-ignore
    getSessionOrFail.mockResolvedValue({ session: mockSession, user: mockUser });

    const formData = createFormDataFromObject({
      basePrice: 60,
      showInlineDayCalendarInMobileView: true,
      clientInvoiceTemplate: "Pay up",
    });
    const res = await updateUserSettings(formData);

    expect(prismaMock.userSettings.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledWith({
      data: {
        basePrice: 60,
        showInlineDayCalendarInMobileView: true,
        clientInvoiceTemplate: "Pay up",
      },
    });
    expect(res).toEqual({ success: true });
  });

  it("should update the user settings with the provided form data if the user settings had existed", async () => {
    const mockUser = { id: 1, email: TEST_USER_EMAIL };
    const mockSession = { user: mockUser };
    // @ts-ignore
    getSessionOrFail.mockResolvedValue({ session: mockSession, user: mockUser });
    // @ts-ignore
    prismaMock.userSettings.findFirst.mockResolvedValue({
      userEmail: mockUser.email,
      basePrice: new Decimal(50),
      showInlineDayCalendarInMobileView: false,
      clientInvoiceTemplate: "Pay up",
    });

    const formData = createFormDataFromObject({
      basePrice: 60,
      showInlineDayCalendarInMobileView: true,
      clientInvoiceTemplate: "Pay up",
    });
    const res = await updateUserSettings(formData);

    expect(prismaMock.userSettings.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.userSettings.create).toHaveBeenCalledTimes(0);
    expect(prismaMock.userSettings.update).toHaveBeenCalledWith({
      where: { userEmail: mockUser.email },
      data: {
        basePrice: 60,
        showInlineDayCalendarInMobileView: true,
        clientInvoiceTemplate: "Pay up",
      },
    });
    expect(res).toEqual({ success: true });
  });
});

// TODO allow partial updates and create test

describe("getUserSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have an auth guard", async () => {
    const result = await getUserSettings();

    expect(getSessionOrFail).toHaveBeenCalledTimes(1);
    expect(result).toEqual(undefined);
  });

  it("should return the user settings", async () => {
    const mockUser = { id: 1, email: "user@example.com" };
    prismaMock.userSettings.upsert.mockResolvedValueOnce({ userEmail: mockUser.email } as any as UserSettings);

    const result = await getUserSettings();

    expect(prismaMock.userSettings.upsert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ userEmail: mockUser.email });
  });
});
