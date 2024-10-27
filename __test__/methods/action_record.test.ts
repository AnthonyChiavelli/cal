/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { getActionRecords } from "@/app/methods/actionRecord";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

describe("getActionRecords", () => {
  it("should return an owner-filtered list of action records", async () => {
    prismaMock.actionRecord.findMany.mockResolvedValue([]);
    await getActionRecords();

    expect(prismaMock.actionRecord.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      where: { ownerId: TEST_USER_EMAIL },
    });
  });
});
