import "@testing-library/jest-dom";
import { ClassType, Student } from "@prisma/client";
import { EventWithRelations } from "@/types";
import { getEventName } from "../../src/util/event";

describe("pluralize", () => {
  it("Handles an event with no students (not expected)", async () => {
    const mockEvent = {
      eventStudents: [],
      classType: ClassType.PRIVATE
    } as any as EventWithRelations
    expect(getEventName(mockEvent)).toBe("Private (empty)")
  })

  it("Handles an event with one student ", async () => {
    const mockEvent = {
      eventStudents: [
        { student: { firstName: "John" } } as any as Student
      ],
      classType: ClassType.PRIVATE
    } as any as EventWithRelations
    expect(getEventName(mockEvent)).toBe("John")
  })

  it("Handles an event with multiple students", async () => {
    const mockEvent = {
      eventStudents: [
        { student: { firstName: "John" } } as any as Student,
        { student: { firstName: "Don" } } as any as Student,
        { student: { firstName: "Juan" } } as any as Student,
      ],
      classType: ClassType.PRIVATE
    } as any as EventWithRelations
    expect(getEventName(mockEvent)).toBe("John | Don | Juan")
  })
});
