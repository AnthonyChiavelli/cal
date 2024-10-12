import { Dispatch } from "react";
import Button from "@/app/components/button";
import { EventCreateAction, IEventCreateState } from "@/app/reducers/event_create";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  eventId?: string;
  onCloseParentModal?: () => void;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormButtons(props: IEventCreateNotesProps) {
  return (
    <div className="flex flex-col gap-3 justify-end pt-5">
      {props.state.validationErrors.length > 0 && <div className="text-red-400">Please fix form errors</div>}
      <Button
        type="submit"
        dataCy="submit-button"
        text={
          props.eventId
            ? `Edit ${props.state.eventType?.toLocaleLowerCase() || "event"}`
            : `Create ${props.state.eventType?.toLocaleLowerCase() || "event"}`
        }
        flavor="primary"
      />
      {props.onCloseParentModal && (
        <Button
          dataCy="cancel-create-event"
          type="button"
          text="Cancel"
          flavor="secondary"
          onClick={props.onCloseParentModal}
        />
      )}
    </div>
  );
}
