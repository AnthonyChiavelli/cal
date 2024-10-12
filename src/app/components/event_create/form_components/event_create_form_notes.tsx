import { Dispatch } from "react";
import { Card, CardBody, Textarea } from "@nextui-org/react";
import { EventCreateAction, EventCreateActionType, IEventCreateState } from "@/app/reducers/event_create";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormNotes(props: IEventCreateNotesProps) {
  return (
    <Card>
      <CardBody>
        <Textarea
          data-cy="class-notes"
          className="cy-class-notes"
          name="notes"
          label="Notes"
          value={props.state.notes}
          onValueChange={(newVal) => props.dispatch({ type: EventCreateActionType.UPDATE_NOTES, payload: newVal })}
        />
      </CardBody>
    </Card>
  );
}
