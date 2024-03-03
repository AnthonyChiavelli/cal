"use server";

import { prisma } from "@/db";
import { createDateString } from "@/util/calendar";
import { ClassType, EventType } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const scheduledFor = new Date(`${formData.get("scheduledForDate")}T${formData.get("scheduledForTime")}`);
  if (formData.get("eventType") === "class") {
    await prisma.event.create({
      data: {
        scheduledFor,
        durationMinutes: Number(formData.get("duration")) as any as number,
        eventType: EventType.CLASS,
        classType: ClassType.PRIVATE,
        notes: formData.get("notes") as string,
        eventStudents: {
          create: (formData.getAll("student") as string[]).map((studentId) => ({
            studentId,
            cost: parseFloat(formData.get(`cost-${studentId}`) as string),
          })),
        },
      },
    });
    return redirect(`/app/schedule?p=day&t=${createDateString(scheduledFor)}`);
  }
}

export async function deleteEvent(classId: string) {
  await prisma.event.delete({ where: { id: classId } });
  return redirect("/app/schedule");
}
