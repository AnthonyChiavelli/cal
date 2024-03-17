import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUserSettings } from "@/app/actions";
import EventCreate from "@/app/components/event_create";
import { getAllStudents } from "@/app/methods/student";

async function AddEvent() {
  const students = await getAllStudents();
  return (
    <div>
      <EventCreate students={students} settings={await getUserSettings()} />
    </div>
  );
}

export default withPageAuthRequired(AddEvent as any, { returnTo: "/app" });
