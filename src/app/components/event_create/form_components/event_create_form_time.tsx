import { Dispatch, useMemo } from "react";
import { Autocomplete, AutocompleteItem, Card, CardBody, Input } from "@nextui-org/react";
import { EventCreateAction, EventCreateActionType, IEventCreateState } from "@/app/reducers/event_create";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormEventType(props: IEventCreateNotesProps) {
  const presetDurationOptions = useMemo(() => ["1:00", "1:30", "2:00", "2:30"], []);

  return (
    <Card>
      <CardBody>
        {/* Date/time settings */}
        <fieldset className="xs:flex flex-row gap-3 space-y-3">
          <legend>Time</legend>
          <Input
            isRequired
            data-cy="scheduledForDate"
            name="scheduledForDate"
            type="date"
            label="Date"
            placeholder="1"
            value={props.state.date}
            onValueChange={(val) => props.dispatch({ type: EventCreateActionType.UPDATE_DATE, payload: val })}
          />
          <Input
            isRequired
            data-cy="scheduledForTime"
            name="scheduledForTime"
            type="time"
            label="Time"
            placeholder="1"
            value={props.state.time}
            onValueChange={(val) => props.dispatch({ type: EventCreateActionType.UPDATE_TIME, payload: val })}
          />
          <Autocomplete
            isRequired
            data-cy="duration"
            allowsCustomValue
            label="Duration"
            placeholder="Duration"
            onValueChange={(val) => props.dispatch({ type: EventCreateActionType.UPDATE_DURATION, payload: val })}
            onSelectionChange={(val) =>
              props.dispatch({ type: EventCreateActionType.UPDATE_DURATION, payload: String(val) })
            }
            value={props.state.duration}
          >
            {presetDurationOptions.map((duration) => (
              <AutocompleteItem key={duration} className="text-black" id={duration}>
                {duration}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </fieldset>
      </CardBody>
    </Card>
  );
}
