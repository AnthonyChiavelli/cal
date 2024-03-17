/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { ActionType } from "@prisma/client";
import { createStudent, deleteStudent, doCSVUpload } from "@/app/actions/student";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

const getStudentMockData = () => {
  const formData = new FormData();
  formData.append("firstName", "Testoolio");
  formData.append("lastName", "Testorini");
  formData.append("gradeLevel", "12");
  formData.append("notes", "Problem Child");
  formData.append("ownerId", "nefarious-jones@test.com");
  return formData;
};

describe("createStudent", () => {
  it("should create a student with the current user as the owner", async () => {
    const mockData = getStudentMockData();
    try {
      await createStudent(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.student.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.create).toHaveBeenCalledWith({
        data: {
          ...Object.fromEntries(mockData),
          gradeLevel: Number(mockData.get("gradeLevel")?.valueOf() as unknown as number),
          ownerId: "test-user@example.com",
        },
      });
    }
  });

  it("should create an EventRecord with the current user as the owner", async () => {
    const mockData = getStudentMockData();
    const mockStudentDBEntity = { id: "1" };
    try {
      prismaMock.student.create.mockResolvedValue(mockStudentDBEntity);
      await createStudent(mockData);
    } catch (err: any) {
      expect(err.message).toBe("NEXT_REDIRECT");
    } finally {
      expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
        data: {
          actionType: ActionType.CREATE_STUDENT,
          additionalData: {
            creationParams: {
              ...Object.fromEntries(mockData),
              gradeLevel: Number(mockData.get("gradeLevel")?.valueOf() as unknown as number),
              ownerId: "test-user@example.com",
            },
            studentObj: mockStudentDBEntity,
          },
          ownerId: "test-user@example.com",
        },
      });
    }
  });
});

describe("doCSVUpload", () => {
  it("should create students from a CSV file with the proper ownership", async () => {
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
          ownerId: "test-user@example.com",
        },
      });
    }
  });
});

describe("deleteStudent", () => {
  it("should delete a student with the current user as the owner", async () => {
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
          ownerId: "test-user@example.com",
        },
      });
    }
  });
});
