"use server";

import { ActionType, ClassType, EventType, Event } from "@prisma/client";
import { redirect } from "next/navigation";
import prisma from "@/db";
import { createDateString } from "@/util/calendar";

export async function createEvent(formData: FormData) {
  const scheduledFor = new Date(`${formData.get("scheduledForDate")}T${formData.get("scheduledForTime")}`);
  formData.entries;
  if (formData.get("eventType") === "class") {
    try {
      const event = await prisma.event.create({
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
      await prisma.actionRecord.create({
        data: {
          actionType: ActionType.SCHEDULE_EVENT,
          additionalData: { event, formData: JSON.parse(JSON.stringify(Object.fromEntries(formData))) },
        },
      });
    } catch (e: any) {
      // TODO better logger
      await prisma.actionRecord.create({
        data: { actionType: ActionType.SCHEDULE_EVENT, success: false, additionalData: { error: e.message } },
      });
    }
    return redirect(`/app/schedule?p=day&t=${createDateString(scheduledFor)}`);
  }
}

export async function deleteEvent(classId: string) {
  await prisma.event.delete({ where: { id: classId } });
  return redirect("/app/schedule");
}

export async function markEventCompleted(event: Event, completed: boolean) {
  await prisma.event.update({ where: { id: event.id }, data: { completed } });
  return { completed };
}
