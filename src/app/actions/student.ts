"use server";

import { ActionType, Prisma } from "@prisma/client";
import csvtojson from "csvtojson";
import { RedirectType, redirect } from "next/navigation";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

interface IStudentFormData {
  firstName: string;
  lastName: string;
  gradeLevel: number;
  notes: string;
  family?: {
    value: string;
  };
}

export async function createStudent(data: IStudentFormData) {
  const { user } = await getSessionOrFail();

  const firstName = data.firstName;
  const lastName = data.lastName;
  const gradeLevel = Number(data.gradeLevel);
  const notes = data.notes;
  const studentData: Prisma.StudentCreateInput = {
    firstName,
    lastName,
    gradeLevel,
    notes,
    owner: { connect: { email: user.email } },
  };
  if (data.family !== undefined) {
    studentData["family"] = { connect: { id: data.family.value } };
  }

  const student = await prisma.student.create({ data: studentData });
  await prisma.actionRecord.create({
    data: {
      actionType: ActionType.CREATE_STUDENT,
      additionalData: { creationParams: JSON.stringify(studentData), studentObj: JSON.stringify(student) },
      ownerId: user.email,
    },
  });
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
