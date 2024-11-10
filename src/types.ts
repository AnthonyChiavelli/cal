import { Event, EventStudent, Prisma, Student } from "@prisma/client";

export type CalendarDay = {
  date: string;
  events: Array<{
    id: string;
    event: Event;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }>;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type EventWithRelations = Event & { eventStudents: Array<EventStudent & { student: Student }> };
export type FamilyWithRelations = Prisma.FamilyGetPayload<{
  include: { parents: true; students: true; invoices: true };
}>;
export type EventStudentWithRelations = Prisma.EventStudentGetPayload<{
  include: { event: true; student: { include: { family: true } } };
}>;
