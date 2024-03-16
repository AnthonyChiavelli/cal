import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUserSettings } from "@/app/actions";
import EventCreate from "@/app/components/event_create";
import prisma from "@/db";

async function AddEvent() {
  const students = await prisma.student.findMany();
  return (
    <div>
      <EventCreate students={students} settings={await getUserSettings()} />
    </div>
  );
}

export default withPageAuthRequired(AddEvent as any, { returnTo: "/app" });
