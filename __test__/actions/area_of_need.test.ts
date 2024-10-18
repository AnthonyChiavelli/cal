/**
 * @jest-environment node
 */
import prisma from "../../src/db";
import { prismaMock } from "../../src/singleton";
import { ActionType, Prisma } from "@prisma/client";
import { updateOrCreateAreaOfNeed, deleteAreaOfNeed } from "@/app/actions/area_of_need";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

describe("updateOrCreateAreaOfNeed", () => {
  it("should create an area of need with the current user as the owner and generate an ActionRecord", async () => {
    prismaMock.areaOfNeed.create.mockResolvedValue({ id: "1" } as any);
    await updateOrCreateAreaOfNeed("Biology");

    expect(prismaMock.areaOfNeed.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.areaOfNeed.create).toHaveBeenCalledWith({
      data: {
        name: "Biology",
        owner: {
          connect: {
            email: "test-user@example.com",
          },
        },
      },
    });
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: ActionType.CREATE_AREA_OF_NEED,
        additionalData: {
          areaOfNeedObj: JSON.stringify({
            name: "Biology",
            owner: {
              connect: {
                email: "test-user@example.com",
              },
            },
          }),
        },
        ownerId: "test-user@example.com",
      },
    });
  });

  it("should not create a duplicate named entity, even differing in case", async () => {
    prismaMock.areaOfNeed.findFirst.mockResolvedValue({ id: "1", name: "Biology" } as any);

    await expect(async () => {
      await updateOrCreateAreaOfNeed("biology");
    }).rejects.toThrow("Area of need with this name already exists");

    prismaMock.areaOfNeed.findFirst.mockResolvedValue({ id: "1", name: "bioLoGy" } as any);

    await expect(async () => {
      await updateOrCreateAreaOfNeed("biology");
    }).rejects.toThrow("Area of need with this name already exists");
  });
});

describe("deleteAreaOfNeed", () => {
  it("should delete an area of need and generate an action record", async () => {
    prismaMock.areaOfNeed.findFirst.mockResolvedValue({
      id: "1",
      name: "Chemistrism",
    } as any);
    prismaMock.areaOfNeed.delete.mockResolvedValue({ id: "1", ownerId: "test-user@example.com" } as any);
    await deleteAreaOfNeed("1");
    expect(prismaMock.areaOfNeed.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.areaOfNeed.delete).toHaveBeenCalledWith({
      where: {
        id: "1",
        ownerId: "test-user@example.com",
      },
    });
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: ActionType.DELETE_AREA_OF_NEED,
        additionalData: {
          areaOfNeedObj: JSON.stringify({
            id: "1",
            name: "Chemistrism",
            owner: {
              connect: {
                email: "test-user@example.com",
              },
            },
          }),
        },
        ownerId: "test-user@example.com",
      },
    });
  });
});
