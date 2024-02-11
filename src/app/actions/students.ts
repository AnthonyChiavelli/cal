"use server";

import csvtojson from "csvtojson";
import { prisma } from "@/db";
import { RedirectType, redirect } from "next/navigation";

export async function doCSVUpload(args: any) {
  "use server";

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
  "use server";
  await prisma.student.delete({ where: { id: studentId } });
  redirect("/app/students", RedirectType.replace);
}