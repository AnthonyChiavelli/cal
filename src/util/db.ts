import { Student } from "@prisma/client";

export function slugifyStudent(student: Student) {
  return `${student.firstName}-${student.lastName}`;
}

export function deslugifyStudentToQuery(slug: string) {
  const [firstName, lastName] = slug.split("-");
  return { firstName, lastName };
}
