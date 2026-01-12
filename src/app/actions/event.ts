"use server";

import prisma from "../../db";
import { ActionType, ClassType, EventType, Prisma, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSessionOrFail } from "@/app/actions";
import { RecurrencePattern } from "@/app/types";
import { createDateString, createMonthString, getDatesForRecurrencePattern } from "@/util/calendar";

interface ICreateEventData {
  scheduledFor: Date;
  duration: number;
  eventType: EventType;
  classType: ClassType;
  notes: string;
  eventStudents: Array<{ studentId: string; cost: number }>;
  recurrencePattern?: RecurrencePattern;
}

async function createEventFromData(
  eventCreationData: ICreateEventData,
  date: Date,
  recurrenceGroupId: string | null,
  user: User,
) {
  const eventCreationQueryObject: { data: Prisma.EventCreateInput } = {
    data: {
      scheduledFor: date,
      durationMinutes: eventCreationData.duration,
      eventType: eventCreationData.eventType,
      notes: eventCreationData.notes,
      owner: {
        connect: { email: user.email },
      },
    },
  };

  if (eventCreationData.classType) {
    eventCreationQueryObject.data.classType = eventCreationData.classType;
  }

  if (eventCreationData.eventStudents?.length > 0) {
    eventCreationQueryObject.data.eventStudents = {
      create: eventCreationData.eventStudents.map((eventStudent) => ({
        ...eventStudent,
        ownerId: user.email,
      })),
    };
  }

  if (recurrenceGroupId !== null) {
    eventCreationQueryObject.data.recurrenceGroup = {
      connect: {
        id: recurrenceGroupId,
      },
    };
  }
  return await prisma.event.create(eventCreationQueryObject);
}

export async function createEvent(data: ICreateEventData) {
  const { user } = await getSessionOrFail();

  if (data.recurrencePattern) {
    const dates = getDatesForRecurrencePattern(data.recurrencePattern);
    const recurrenceGroup = await createRecurrenceGroup();

    try {
      Promise.all;
      for (const date of dates) {
        await createEventFromData(data, date, recurrenceGroup.id, user);
      }
    } catch (e: any) {
      // If any event fails to create, delete all events belonging to the recurrence group
      if (recurrenceGroup !== undefined) {
        await prisma.event.deleteMany({ where: { recurrenceGroupId: recurrenceGroup.id } });
        await prisma.recurrenceGroup.delete({ where: { id: recurrenceGroup.id } });
        await prisma.actionRecord.create({
          data: {
            actionType: ActionType.CREATE_RECURRING_EVENT,
            success: false,
            additionalData: {
              details: "Error occured during recurrent event creation, all events deleted",
              error: e.message,
            },
            owner: {
              connect: { email: user.email },
            },
          },
        });
        throw e;
      }
    }

    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_RECURRING_EVENT,
        success: true,
        additionalData: { recurrenceGroup, formData: JSON.parse(JSON.stringify(data)) },
        ownerId: user.email,
      },
    });
    return redirect(
      `/app/schedule?p=month&t=${createMonthString(dates[0]?.getFullYear() || new Date().getFullYear(), dates[0]?.getMonth() || new Date().getMonth() + 1)}`,
    );
  } else {
    try {
      const event = await createEventFromData(data, data.scheduledFor, null, user);
      await prisma.actionRecord.create({
        data: {
          actionType: ActionType.SCHEDULE_EVENT,
          success: true,
          additionalData: { event, formData: JSON.parse(JSON.stringify(data)) },
          ownerId: user.email,
        },
      });
    } catch (e: any) {
      await prisma.actionRecord.create({
        data: {
          actionType: ActionType.SCHEDULE_EVENT,
          success: false,
          additionalData: { error: e.message },
          ownerId: user.email,
        },
      });
      throw e;
    }
    return redirect(`/app/schedule?p=day&t=${createDateString(data.scheduledFor)}`);
  }
}

// TODO do we need this?
export async function deleteEvent(classId: string) {
  const { user } = await getSessionOrFail();
  await prisma.event.delete({ where: { id: classId, ownerId: user.email } });
  return redirect("/app/schedule");
}

export async function markEventCompleted(eventId: string, completed: boolean) {
  const { user } = await getSessionOrFail();
  try {
    const event = await prisma.event.findFirstOrThrow({
      where: { id: eventId, ownerId: user.email },
      include: { eventStudents: { include: { student: { include: { family: true } } } } },
    });
    if (event.cancelledAt) {
      throw new Error("Cannot mark a cancelled event as complete");
    }

    const eventUpdateQuery = prisma.event.update({ where: { id: eventId, ownerId: user.email }, data: { completed } });
    const familyUpdateQueries = event.eventStudents.map((eventStudent) => {
      const family = eventStudent.student.family;
      return family
        ? prisma.family.update({
            where: { id: family.id },
            data: { balance: { increment: eventStudent.cost } },
          })
        : null;
    })
    // TODO fix
    await prisma.$transaction([eventUpdateQuery, ...familyUpdateQueries.filter(q => q !== null)]);

    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.MARK_COMPLETE_EVENT,
        success: true,
        additionalData: { eventId: eventId },
        ownerId: user.email,
      },
    });
  } catch (e: any) {
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.MARK_COMPLETE_EVENT,
        success: false,
        additionalData: { error: e.message },
        ownerId: user.email,
      },
    });
    throw e;
  }
  return { completed };
}

export async function cancelEvent(eventId: string) {
  const { user } = await getSessionOrFail();
  try {
    const event = await prisma.event.findFirstOrThrow({ where: { id: eventId, ownerId: user.email } });
    if (event.completed) {
      throw new Error("Cannot cancel an event that has been marked as complete");
    }
    await prisma.event.update({ where: { id: eventId, ownerId: user.email }, data: { cancelledAt: new Date() } });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CANCEL_EVENT,
        success: true,
        additionalData: { eventId: eventId },
        ownerId: user.email,
      },
    });
  } catch (e: any) {
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CANCEL_EVENT,
        success: false,
        additionalData: { error: e.message },
        ownerId: user.email,
      },
    });
    throw e;
  }
}

export async function createRecurrenceGroup() {
  const { user } = await getSessionOrFail();

  const group = await prisma.recurrenceGroup.create({
    data: {
      ownerId: user.email,
    },
  });

  return group;
}
