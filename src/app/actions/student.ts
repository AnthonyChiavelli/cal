"use server";

import { ActionType, Prisma } from "@prisma/client";
import csvtojson from "csvtojson";
import { RedirectType, redirect } from "next/navigation";
import { getSessionOrFail } from "@/app/actions/util";
import prisma from "@/db";

interface IStudentFormData {
  firstName: string;
  lastName: string;
  gradeLevel: number;
  areasOfNeed: Array<{ value: string; __isNew__?: boolean }>;
  family?: { value: string };
  notes?: string;
}

export async function updateOrCreateStudent(data: IStudentFormData, studentId?: string): Promise<{ success: boolean }> {
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
  if (data.areasOfNeed !== undefined) {
    if (data.areasOfNeed.length === 0) {
      // @ts-ignore This works but fails typecheck
      studentData["areaOfNeed"] = { set: [] };
    } else {
      // TODO check for near-duplicate areas of need
      studentData["areaOfNeed"] = {
        connect: data.areasOfNeed.filter((a) => !a.__isNew__).map((area) => ({ id: area.value })),
        create: data.areasOfNeed
          .filter((a) => a.__isNew__)
          .map((area) => ({ name: area.value, owner: { connect: { email: user.email } } })),
      };
    }
  }
  if (studentId !== undefined) {
    await prisma.student.update({ where: { id: studentId, ownerId: user.email }, data: studentData });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.UPDATE_STUDENT,
        additionalData: { studentId, studentObj: JSON.stringify(studentData) },
        ownerId: user.email,
      },
    });
    return { success: true };
  } else {
    await prisma.student.create({ data: studentData });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_STUDENT,
        additionalData: { studentObj: JSON.stringify(studentData) },
        ownerId: user.email,
      },
    });
  }
  return { success: true };
}

export async function doCSVUpload(data: FormData) {
  const { user } = await getSessionOrFail();

  const csvFile = data.get("csvFile") as File;
  const csvResults = await csvtojson({ output: "json" }).fromString(await csvFile.text());
  // TODO use for of loop
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
  await prisma.actionRecord.create({
    data: {
      actionType: ActionType.DELETE_STUDENT,
      additionalData: { studentId },
      ownerId: user.email,
    },
  });
  redirect("/app/students", RedirectType.replace);
}
