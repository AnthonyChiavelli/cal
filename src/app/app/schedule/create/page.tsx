import EventCreate from "@/app/components/event_create";
import { prisma } from "@/db";

export default async function CreateEvent() {
  const students = await prisma.student.findMany();

  return (
    <div>
      <h1>Create Event</h1>
      <EventCreate students={students} />
    </div>
  );
}
