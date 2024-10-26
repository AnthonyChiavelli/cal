/**
 * @jest-environment node
 */
import { getSessionOrFail } from "../../src/app/actions/util";
import { prismaMock } from "../../src/singleton";
import { getSession } from "@auth0/nextjs-auth0";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { TEST_USER_EMAIL } from "../constants";

jest.mock("@auth0/nextjs-auth0", () => {
  return {
    getSession: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL } })),
  };
});

jest.mock("next/navigation");

describe("getSessionOrFail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
  });

  it("should return session and user when session exists and user is found", async () => {
    const mockSession = { user: { email: TEST_USER_EMAIL } };
    const mockUser = { id: 1, email: TEST_USER_EMAIL };

    prismaMock.user.findFirst.mockResolvedValue(mockUser as any as User);
    // @ts-ignore
    getSession.mockResolvedValueOnce(mockSession);
    const result = await getSessionOrFail();

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: { equals: mockUser.email, mode: "insensitive" } },
    });
    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({ session: mockSession, user: mockUser });
  });

  it("should redirect when session exists but user is not found", async () => {
    // @ts-ignore
    getSession.mockClear();
    const mockSession = { user: { email: TEST_USER_EMAIL } };
    await getSessionOrFail();
    // @ts-ignore
    getSession.mockResolvedValueOnce(mockSession);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalled();
  });

  it("should redirect when no session exists", async () => {
    // @ts-ignore
    getSession.mockClear();
    await getSessionOrFail();

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalled();
  });
});
