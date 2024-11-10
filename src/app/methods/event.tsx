import { Prisma } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions/util";
import prisma from "@/db";

export async function getEvents(where: { [key: string]: any }) {
  const { user } = await getSessionOrFail();
  return prisma.event.findMany({
    orderBy: { scheduledFor: "asc" },
    where: { ...where, ownerId: user.email },
    include: { eventStudents: { include: { student: true } } },
  });
}

export async function getEvent(eventId: string) {
  const { user } = await getSessionOrFail();
  return prisma.event.findFirst({
    where: { id: eventId, ownerId: user.email },
    include: { eventStudents: { include: { student: true } } },
  });
}

export async function getUninvoicedEvents(): Promise<
  Prisma.EventStudentGetPayload<{ include: { event: true; student: { include: { family: true } } } }>[]
> {
  const { user } = await getSessionOrFail();

  return await prisma.eventStudent.findMany({
    where: {
      ownerId: { equals: user.email },
      invoiceId: { equals: null },
    },
    include: { event: true, student: { include: { family: true } } },
  });
}
