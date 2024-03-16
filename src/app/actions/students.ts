"use server";

import { ActionType } from "@prisma/client";
import csvtojson from "csvtojson";
import { RedirectType, redirect } from "next/navigation";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function createStudent(data: FormData) {
  await getSessionOrFail();

  const firstName = data.get("firstName")?.valueOf() as string;
  const lastName = data.get("lastName")?.valueOf() as string;
  const gradeLevel = parseInt(data.get("gradeLevel")?.valueOf() as string);
  const notes = data.get("notes")?.valueOf() as string;
  const studentData = { firstName, lastName, gradeLevel, notes };
  try {
    const student = await prisma.student.create({ data: studentData });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_STUDENT,
        additionalData: { creationParams: studentData, studentObj: student },
      },
    });
  } catch (err) {
    // TODO Better logging
    console.error("Error creating student", err);
  }
  redirect("/app/students");
}

export async function doCSVUpload(args: any) {
  await getSessionOrFail();

  const csvFile = args.get("csvFile") as File;

  const csvResults = await csvtojson({ output: "json" }).fromString(await csvFile.text());
  await csvResults.forEach(async (student) => {
    await prisma.student.create({
      data: {
        firstName: student["First Name"],
        lastName: student["Last Name"],
        gradeLevel: parseInt(student["Grade Level"]),
        notes: student["Notes"],
      },
    });
  });
  redirect("/app/students?importComplete=true", RedirectType.replace);
}

export async function deleteStudent(studentId: string) {
  await getSessionOrFail();

  await prisma.student.delete({ where: { id: studentId } });
  redirect("/app/students", RedirectType.replace);
}
