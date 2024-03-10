import { Event, EventStudent, Family, Invoice, Parent, Student } from "@prisma/client";

export type CalendarDay = {
  date: string;
  events: Array<{
    id: string;
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
export type FamilyWithRelations = Family & { parents: Parent[]; students: Student[]; invoices: Invoice[] };
