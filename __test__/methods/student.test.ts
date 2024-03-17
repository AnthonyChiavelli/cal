/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { Student } from "@prisma/client";
import { getAllStudents, getStudent, getStudents } from "@/app/methods/student";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

describe("getStudents", () => {
  it("should return an owner-filtered list of students with no search query", async () => {
    const mockData = { page: 1 };
    const mockStudentDBEntity = { id: "1" };

    prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
    const result = await getStudents(mockData);
    expect(result).toEqual([mockStudentDBEntity]);

    expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
      where: {
        ownerId: {
          equals: "test-user@example.com",
        },
      },
    });
  });

  it.each(
    [1, 2, 3, 4, 5],
    "should return an owner-filtered list of students based on the correct pagination",
    async (pageNumber: number) => {
      const mockData = { page: pageNumber };
      const mockStudentDBEntity = { id: "1" };

      prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
      await getStudents(mockData);

      expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: (pageNumber - 1) * 10, take: 10 }),
      );
    },
  );

  it("should return an owner-filtered list of students with a search query", async () => {
    const mockData = { page: 1, search: "test" };
    const mockStudentDBEntity = { id: "1" };

    prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
    const result = await getStudents(mockData);
    expect(result).toEqual([mockStudentDBEntity]);

    expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
      where: {
        ownerId: {
          equals: "test-user@example.com",
        },
        OR: [
          {
            firstName: {
              contains: "test",
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: "test",
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: "test",
              mode: "insensitive",
            },
          },
        ],
      },
    });
  });
});

describe("getTotalStudentCount", () => {
  it("should return an owner-filtered count of students with no search query", async () => {
    const mockData = { page: 1 };
    const mockStudentDBEntity = { id: "1" };

    prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
    const result = await getStudents(mockData);
    expect(result).toEqual([mockStudentDBEntity]);

    expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
      where: {
        ownerId: {
          equals: "test-user@example.com",
        },
      },
    });
  });

  it.each(
    [1, 2, 3, 4, 5],
    "should return an owner-filtered count of students based on the correct pagination",
    async (pageNumber: number) => {
      const mockData = { page: pageNumber };
      const mockStudentDBEntity = { id: "1" };

      prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
      await getStudents(mockData);

      expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.student.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: (pageNumber - 1) * 10, take: 10 }),
      );
    },
  );

  it("should return an owner-filtered count of students with a search query", async () => {
    const mockData = { page: 1, search: "test" };
    const mockStudentDBEntity = { id: "1" };

    prismaMock.student.findMany.mockResolvedValue([mockStudentDBEntity as Student]);
    const result = await getStudents(mockData);
    expect(result).toEqual([mockStudentDBEntity]);

    expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
      where: {
        ownerId: {
          equals: "test-user@example.com",
        },
        OR: [
          {
            firstName: {
              contains: "test",
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: "test",
              mode: "insensitive",
            },
          },
          {
            notes: {
              contains: "test",
              mode: "insensitive",
            },
          },
        ],
      },
    });
  });
});

describe("getAllStudents", () => {
  it("should query for all student with the proper owner filter", async () => {
    prismaMock.student.findMany.mockResolvedValue([]);
    await getAllStudents();

    expect(prismaMock.student.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ownerId: {
          equals: "test-user@example.com",
        },
      },
    });
  });
});

describe("getStudent", () => {
  it("should query a student with the proper owner filter", async () => {
    const mockStudentDBEntity = { id: "1" };
    prismaMock.student.findFirst.mockResolvedValue(mockStudentDBEntity as Student);
    const result = await getStudent("1");

    expect(result).toEqual(mockStudentDBEntity);
    expect(prismaMock.student.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.student.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "1", ownerId: "test-user@example.com" } }),
    );
  });
});
