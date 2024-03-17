"use server";

import { ActionType } from "@prisma/client";
import csvtojson from "csvtojson";
import { RedirectType, redirect } from "next/navigation";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function createStudent(data: FormData) {
  const { user } = await getSessionOrFail();

  const firstName = data.get("firstName")?.valueOf() as string;
  const lastName = data.get("lastName")?.valueOf() as string;
  const gradeLevel = parseInt(data.get("gradeLevel")?.valueOf() as string);
  const notes = data.get("notes")?.valueOf() as string;
  const studentData = { firstName, lastName, gradeLevel, notes, ownerId: user.email };
  try {
    const student = await prisma.student.create({ data: studentData });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_STUDENT,
        additionalData: { creationParams: studentData, studentObj: student },
        ownerId: user.email,
      },
    });
  } catch (err) {
    console.error("Error creating student", err);
  }
  redirect("/app/students");
}

export async function doCSVUpload(data: FormData) {
  const { user } = await getSessionOrFail();

  const csvFile = data.get("csvFile") as File;
  const csvResults = await csvtojson({ output: "json" }).fromString(await csvFile.text());
  await csvResults.forEach(async (student) => {
    await prisma.student.create({
      data: {
        firstName: student["First Name"],
        lastName: student["Last Name"],
        gradeLevel: parseInt(student["Grade Level"]),
        notes: student["Notes"],
        ownerId: user.email,
      },
    });
  });
  redirect("/app/students?importComplete=true", RedirectType.replace);
}

export async function deleteStudent(studentId: string) {
  const { user } = await getSessionOrFail();

  await prisma.student.delete({ where: { id: studentId, ownerId: user.email } });
  redirect("/app/students", RedirectType.replace);
}
