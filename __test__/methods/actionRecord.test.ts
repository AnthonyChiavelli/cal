/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { getActionRecords } from "@/app/methods/actionRecord";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

describe("getActionRecords", () => {
  it("should return an owner-filtered list of action records", async () => {
    prismaMock.actionRecord.findMany.mockResolvedValue([]);
    await getActionRecords();

    expect(prismaMock.actionRecord.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      where: { ownerId: "test-user@example.com" },
    });
  });
});
