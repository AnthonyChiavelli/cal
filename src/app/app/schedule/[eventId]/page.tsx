import { deleteEvent, cancelEvent } from "@/app/actions/event";
import Button from "@/app/components/button";
import { getEvent } from "@/app/methods/event";

interface IClassProps {
  params: {
    eventId: string;
  };
}

export default async function Class(props: IClassProps) {
  const classObj = await getEvent(props.params.eventId);
  return (
    <div className="overflow-y-auto">
      <code className="whitespace-pre">sfd: {JSON.stringify(classObj, null, 2)}</code>;
      <Button flavor="danger" text="Delete" onClick={deleteEvent.bind(deleteEvent, props.params.eventId)} />
      <Button flavor="danger" text="Cancel" onClick={cancelEvent.bind(deleteEvent, props.params.eventId)} />
    </div>
  );
}
