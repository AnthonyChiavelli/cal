"use server";

import prisma from "../../db";
import { createDateString } from "../../util/calendar";
import { ActionType, ClassType, EventType } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSessionOrFail } from "./util";

export async function createEvent(formData: FormData) {
  await getSessionOrFail();

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
      await prisma.actionRecord.create({
        data: { actionType: ActionType.SCHEDULE_EVENT, success: false, additionalData: { error: e.message } },
      });
      throw e;
    }
    return redirect(`/app/schedule?p=day&t=${createDateString(scheduledFor)}`);
  }
}

// TODO do we need this?
export async function deleteEvent(classId: string) {
  await getSessionOrFail();
  await prisma.event.delete({ where: { id: classId } });
  return redirect("/app/schedule");
}

export async function markEventCompleted(eventId: string, completed: boolean) {
  await getSessionOrFail();
  try {
    const event = await prisma.event.findFirstOrThrow({ where: { id: eventId } });
    if (event.cancelledAt) {
      throw new Error("Cannot mark a cancelled event as complete");
    }
    await prisma.event.update({ where: { id: eventId }, data: { completed } });
    await prisma.actionRecord.create({
      data: { actionType: ActionType.MARK_COMPLETE_EVENT, success: true, additionalData: { eventId: eventId } },
    });
  } catch (e) {
    await prisma.actionRecord.create({
      data: { actionType: ActionType.MARK_COMPLETE_EVENT, success: false, additionalData: { error: e.message } },
    });
    throw e;
  }
  return { completed };
}

export async function cancelEvent(eventId: string) {
  await getSessionOrFail();
  try {
    const event = await prisma.event.findFirstOrThrow({ where: { id: eventId } });
    if (event.completed) {
      throw new Error("Cannot cancel an event that has been marked as complete");
    }
    await prisma.event.update({ where: { id: eventId }, data: { cancelledAt: new Date() } });
    await prisma.actionRecord.create({
      data: { actionType: ActionType.CANCEL_EVENT, success: true, additionalData: { eventId: eventId } },
    });
  } catch (e) {
    await prisma.actionRecord.create({
      data: { actionType: ActionType.CANCEL_EVENT, success: false, additionalData: { error: e.message } },
    });
    throw e;
  }
}
