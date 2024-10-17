/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { ActionType, Prisma } from "@prisma/client";
import { updateOrCreateFamily, deleteFamily } from "@/app/actions/family";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

const getFamilyMockData = () => {
  return {
    familyName: "Tingledumper",
    parent1FirstName: "Scane",
    parent1LastName: "Tingledumper",
    parent1Phone: "(555) 555-5555",
    parent2FirstName: "Thrixy",
    parent2LastName: "Humpenstump",
    parent2Phone: "(555) 555-5556",
    notes: "Some notes",
  };
};

describe("updateOrCreateFamily", () => {
  it("should create a family with the current user as the owner and generate an ActionRecord", async () => {
    const mockData = getFamilyMockData();
    try {
      await updateOrCreateFamily(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.family.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.family.create).toHaveBeenCalledWith({
        data: {
          balance: 0,
          familyName: "Tingledumper",
          notes: "Some notes",
          owner: {
            connect: {
              email: "test-user@example.com",
            },
          },
          parents: {
            create: [
              {
                email: "",
                firstName: "Scane",
                isPrimary: true,
                lastName: "Tingledumper",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5555",
              },
              {
                email: "",
                firstName: "Thrixy",
                isPrimary: false,
                lastName: "Humpenstump",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5556",
              },
            ],
          },
        },
      });
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.CREATE_FAMILY,
          additionalData: {
            familyObj: JSON.stringify(mockData),
          },
          ownerId: "test-user@example.com",
        },
      });
    }
  });

  it("should update a family if it belongs to current user and generate an action record", async () => {
    const mockData = getFamilyMockData();
    try {
      await updateOrCreateFamily({ ...mockData, parent1FirstName: "Toobus", notes: "New notes" }, "1");
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.family.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.family.update).toHaveBeenCalledWith({
        where: {
          id: "1",
          ownerId: "test-user@example.com",
        },
        data: {
          familyName: "Tingledumper",
          notes: "New notes",
          parents: {
            create: [
              {
                email: "",
                firstName: "Toobus",
                isPrimary: true,
                lastName: "Tingledumper",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5555",
              },
              {
                email: "",
                firstName: "Thrixy",
                isPrimary: false,
                lastName: "Humpenstump",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5556",
              },
            ],
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.UPDATE_FAMILY,
          additionalData: {
            familyId: "1",
            familyObj: JSON.stringify({
              ...mockData,
              parent1FirstName: "Toobus",
              notes: "New notes",
            }),
          },
          ownerId: "test-user@example.com",
        },
      });
    }
  });

  it("should not create an action record if creation fails", async () => {
    prismaMock.family.create.mockRejectedValueOnce(new Error("Failed to update"));
    const mockData = getFamilyMockData();
    try {
      await updateOrCreateFamily({ ...mockData });
    } catch (err: any) {
      expect(err.message).toBe("Failed to update");
    } finally {
      expect(prismaMock.family.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.family.create).toHaveBeenCalledWith({
        data: {
          balance: 0,
          familyName: "Tingledumper",
          notes: "Some notes",
          owner: {
            connect: {
              email: "test-user@example.com",
            },
          },
          parents: {
            create: [
              {
                email: "",
                firstName: "Scane",
                isPrimary: true,
                lastName: "Tingledumper",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5555",
              },
              {
                email: "",
                firstName: "Thrixy",
                isPrimary: false,
                lastName: "Humpenstump",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5556",
              },
            ],
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(0);
    }
  });

  it("should not create an action record if update fails", async () => {
    prismaMock.family.update.mockRejectedValueOnce(new Error("Failed to update"));
    const mockData = getFamilyMockData();
    try {
      await updateOrCreateFamily({ ...mockData }, "1");
    } catch (err: any) {
      expect(err.message).toBe("Failed to update");
    } finally {
      expect(prismaMock.family.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.family.update).toHaveBeenCalledWith({
        where: {
          id: "1",
          ownerId: "test-user@example.com",
        },
        data: {
          familyName: "Tingledumper",
          notes: "Some notes",
          parents: {
            create: [
              {
                email: "",
                firstName: "Scane",
                isPrimary: true,
                lastName: "Tingledumper",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5555",
              },
              {
                email: "",
                firstName: "Thrixy",
                isPrimary: false,
                lastName: "Humpenstump",
                ownerId: "test-user@example.com",
                phone: "(555) 555-5556",
              },
            ],
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(0);
    }
  });
});

describe("deleteFamily", () => {
  it("should delete a family with the current user as the owner", async () => {
    prismaMock.family.findUnique.mockResolvedValueOnce({ students: [] });
    const familyId = "1";
    try {
      await deleteFamily(familyId);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.family.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.family.findUnique).toHaveBeenCalledWith({
        where: {
          id: familyId,
          ownerId: "test-user@example.com",
        },
        include: {
          students: true,
        },
      });
      expect(prismaMock.family.delete).toHaveBeenCalledWith({
        where: {
          id: familyId,
          ownerId: "test-user@example.com",
        },
      });
    }
  });
  it("should not delete a family if it has students", async () => {
    prismaMock.family.findUnique.mockResolvedValueOnce({ students: [{}, {}] });
    const familyId = "1";
    try {
      await deleteFamily(familyId);
    } catch (err: any) {
      expect(err.message).toBe("Family has students");
    } finally {
      expect(prismaMock.family.delete).toHaveBeenCalledTimes(0);
    }
  });
});
