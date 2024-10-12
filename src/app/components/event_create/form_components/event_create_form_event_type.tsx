import { Dispatch } from "react";
import { Card, CardBody, Radio, RadioGroup, cn } from "@nextui-org/react";
import { EventType } from "@prisma/client";
import { EventCreateAction, EventCreateActionType, IEventCreateState } from "@/app/reducers/event_create";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormEventType(props: IEventCreateNotesProps) {
  return (
    <Card>
      <CardBody>
        <RadioGroup
          name="eventType"
          value={props.state.eventType}
          onValueChange={(value) =>
            props.dispatch({ type: EventCreateActionType.UPDATE_EVENT_TYPE, payload: value as EventType })
          }
          classNames={{
            wrapper: cn("xs:flex-row flex-col justify-around"),
          }}
        >
          <Radio value={EventType.CLASS} data-cy="class-radio-option">
            Class
          </Radio>
          <Radio value={EventType.CONSULTATION} data-cy="consultation-radio-option">
            Consultation
          </Radio>
        </RadioGroup>
      </CardBody>
    </Card>
  );
}
