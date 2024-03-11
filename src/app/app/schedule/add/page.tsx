import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import EventCreate from "@/app/components/event_create";
import { prisma } from "@/db";

async function AddEvent() {
  const students = await prisma.student.findMany();
  return (
    <div>
      <EventCreate students={students} />
    </div>
  );
}

export default withPageAuthRequired(AddEvent as any, { returnTo: "/app" });
