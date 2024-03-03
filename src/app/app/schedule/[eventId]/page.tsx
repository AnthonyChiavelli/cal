import { deleteEvent } from "@/app/actions/events";
import Button from "@/app/components/button";
import { prisma } from "@/db";

interface IClassProps {
  params: {
    eventId: string;
  };
}

async function fetchClass(eventId: string) {
  return prisma.event.findFirstOrThrow({
    where: { id: eventId },
    include: { eventStudents: { include: { student: true } } },
  });
}

export default async function Class(props: IClassProps) {
  const classObj = await fetchClass(props.params.eventId);
  return (
    <div className="overflow-y-auto">
      <code className="whitespace-pre">sfd: {JSON.stringify(classObj, null, 2)}</code>;
      <Button flavor="danger" text="Delete" onClick={deleteEvent.bind(deleteEvent, props.params.eventId)} />
    </div>
  );
}
