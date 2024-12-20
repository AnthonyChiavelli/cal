/**
 * @jest-environment node
 */
import { updateOrCreateStudent, deleteStudent, doCSVUpload } from "../../src/app/actions/student";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { ActionType } from "@prisma/client";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

const getStudentMockData = () => {
  return {
    firstName: "Testoolio",
    lastName: "Testorini",
    gradeLevel: 12,
    notes: "Problem Child",
  };
};

describe("updateOrCreateStudent", () => {
  it("should create a student with the current user as the owner and generate an ActionRecord", async () => {
    const mockData = getStudentMockData();
    try {
      await updateOrCreateStudent(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          owner: {
            connect: {
              email: TEST_USER_EMAIL,
            },
          },
        },
      });
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.CREATE_STUDENT,
          additionalData: {
            studentObj: JSON.stringify({
              ...mockData,
              owner: {
                connect: {
                  email: TEST_USER_EMAIL,
                },
              },
            }),
          },
          ownerId: TEST_USER_EMAIL,
        },
      });
    }
  });

  it("should update a student if it belongs to current user and generate an action record", async () => {
    const mockData = getStudentMockData();
    try {
      await updateOrCreateStudent(mockData, "1");
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.update).toHaveBeenCalledWith({
        where: {
          id: "1",
          ownerId: TEST_USER_EMAIL,
        },
        data: {
          ...mockData,
          owner: {
            connect: {
              email: TEST_USER_EMAIL,
            },
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.UPDATE_STUDENT,
          additionalData: {
            studentId: "1",
            studentObj: JSON.stringify({
              ...mockData,
              owner: {
                connect: {
                  email: TEST_USER_EMAIL,
                },
              },
            }),
          },
          ownerId: TEST_USER_EMAIL,
        },
      });
    }
  });

  it("should not create an action record if creation fails", async () => {
    prismaMock.student.create.mockRejectedValueOnce(new Error("Failed to update"));
    const mockData = getStudentMockData();
    try {
      await updateOrCreateStudent(mockData);
    } catch (err: any) {
      expect(err.message).toBe("Failed to update");
    } finally {
      expect(prismaMock.student.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.create).toHaveBeenCalledWith({
        data: {
          ...mockData,
          owner: {
            connect: {
              email: TEST_USER_EMAIL,
            },
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(0);
    }
  });

  it("should not create an action record if update fails", async () => {
    prismaMock.student.update.mockRejectedValueOnce(new Error("Failed to update"));
    const mockData = getStudentMockData();
    try {
      await updateOrCreateStudent(mockData, "1");
    } catch (err: any) {
      expect(err.message).toBe("Failed to update");
    } finally {
      expect(prismaMock.student.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.update).toHaveBeenCalledWith({
        where: {
          id: "1",
          ownerId: TEST_USER_EMAIL,
        },
        data: {
          ...mockData,
          owner: {
            connect: {
              email: TEST_USER_EMAIL,
            },
          },
        },
      });

      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(0);
    }
  });

  it("should create Areas Of Need on the fly if they don't exist already", async () => {
    const mockData = {
      ...getStudentMockData(),
      areasOfNeed: [{ value: "Test Area" }, { value: "New Label", __isNew__: true }],
    };
    try {
      await updateOrCreateStudent(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.create).toHaveBeenCalledWith({
        data: {
          ...getStudentMockData(),
          areaOfNeed: {
            connect: [{ id: "Test Area" }],
            create: [{ name: "New Label", owner: { connect: { email: TEST_USER_EMAIL } } }],
          },
          owner: {
            connect: {
              email: TEST_USER_EMAIL,
            },
          },
        },
      });
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.CREATE_STUDENT,
          additionalData: {
            studentObj: JSON.stringify({
              firstName: "Testoolio",
              lastName: "Testorini",
              gradeLevel: 12,
              notes: "Problem Child",
              owner: { connect: { email: TEST_USER_EMAIL } },
              areaOfNeed: {
                connect: [{ id: "Test Area" }],
                create: [{ name: "New Label", owner: { connect: { email: TEST_USER_EMAIL } } }],
              },
            }),
          },
          ownerId: TEST_USER_EMAIL,
        },
      });
    }
  });
});

describe("doCSVUpload", () => {
  it("should create students from a CSV file with the proper ownership", async () => {
    // TODO flesh out. Should create action record
    const mockData = new FormData();
    const mockCSV = `First Name,Last Name,Grade Level,Notes
      Testoolio,Testorini,12,Problem Child
      Testathon,McTest,10,Golden Child
      Testbastian,Testfool,8,Special Child`;
    const mockFile = new File([mockCSV], "test.csv");
    mockData.append("csvFile", mockFile);
    try {
      await doCSVUpload(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.create).toHaveBeenCalledTimes(3);
      expect(prismaMock.student.create).toHaveBeenCalledWith({
        data: {
          firstName: "Testoolio",
          lastName: "Testorini",
          gradeLevel: 12,
          notes: "Problem Child",
          ownerId: TEST_USER_EMAIL,
        },
      });
    }
  });
});

describe("deleteStudent", () => {
  it("should delete a student with the current user as the owner and generate action record", async () => {
    const studentId = "1";
    try {
      await deleteStudent(studentId);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.delete).toHaveBeenCalledWith({
        where: {
          id: studentId,
          ownerId: TEST_USER_EMAIL,
        },
      });
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.DELETE_STUDENT,
          additionalData: { studentId },
          ownerId: TEST_USER_EMAIL,
        },
      });
    }
  });
  it("should not create an action record if the delete fails", async () => {
    prismaMock.student.delete.mockRejectedValueOnce(new Error("Failed to delete"));
    const studentId = "1";
    try {
      await deleteStudent(studentId);
    } catch (err: any) {
      expect(err.message).toBe("Failed to delete");
    } finally {
      expect(prismaMock.student.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.delete).toHaveBeenCalledWith({
        where: {
          id: studentId,
          ownerId: TEST_USER_EMAIL,
        },
      });
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(0);
    }
  });
});
