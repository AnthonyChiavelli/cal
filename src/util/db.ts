import { Student } from "@prisma/client";
import { env } from "process";
import prisma from "@/db";

export function slugifyStudent(student: Student) {
  return `${student.firstName}-${student.lastName}`;
}

export function deslugifyStudentToQuery(slug: string) {
  const [firstName, lastName] = slug.split("-");
  return { firstName, lastName };
}

export async function clearAllSeedData() {
  const collectionsToClear = ["eventStudent", "student", "event", "family", "actionRecord"];
  for (const collection of collectionsToClear) {
    // @ts-ignore
    // @ts-ignore
    await prisma[collection].deleteMany({
      where: {
        ownerId: env.AUTH0_USERNAME,
      },
    });
  }
}
