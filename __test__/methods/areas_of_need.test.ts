/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { getAreasOfNeed } from "@/app/methods/areaofNeed";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

describe("getAreasOfNeed", () => {
  it("should return an owner-filtered list of areasOfNeed", async () => {
    prismaMock.areaOfNeed.findMany.mockResolvedValue([]);
    await getAreasOfNeed();

    expect(prismaMock.areaOfNeed.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.areaOfNeed.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
      where: { ownerId: TEST_USER_EMAIL },
    });
  });
});
