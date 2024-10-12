import { Dispatch, useMemo } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Switch,
  cn,
} from "@nextui-org/react";
import RecurrencePreview from "../../recurrence_preview";
import { EventCreateAction, EventCreateActionType, IEventCreateState } from "@/app/reducers/event_create";
import { DayOfWeek, RecurrencePattern } from "@/app/types";
import {
  compareDatesWithoutTime,
  createDateString,
  getDatesForRecurrencePattern,
  isCompleteRecurrencePattern,
  parseDateString,
} from "@/util/calendar";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormRecurrence(props: IEventCreateNotesProps) {
  const currentDateWouldntBeIncluded = useMemo(() => {
    if (isCompleteRecurrencePattern(props.state.recurrencePattern)) {
      const recurrenceDates = getDatesForRecurrencePattern({
        ...props.state.recurrencePattern,
        includeSelectedDate: false,
      });
      return !recurrenceDates.some((date) => compareDatesWithoutTime(date, parseDateString(props.state.date)) === 0);
    }
    return false;
  }, [props.state.date, props.state.recurrencePattern]);

  const showRecurrencePreview = useMemo(
    () =>
      props.state.date &&
      props.state.recurrenceEnabled &&
      props.state.recurrencePattern?.endDate &&
      props.state.recurrencePattern?.period &&
      (props.state.recurrencePattern?.weeklyDays?.length || 0) > 0,

    [
      props.state.date,
      props.state.recurrenceEnabled,
      props.state.recurrencePattern?.endDate,
      props.state.recurrencePattern?.period,
      props.state.recurrencePattern?.weeklyDays?.length,
    ],
  );

  return (
    <Card>
      <CardBody>
        <Switch
          onValueChange={(val) =>
            props.dispatch({ type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED, payload: val })
          }
        >
          Recurring?
        </Switch>
        {props.state.recurrenceEnabled && (
          <>
            <div>
              <RadioGroup
                name="eventType"
                value={props.state.recurrencePattern?.recurrenceType || "weekly"}
                onValueChange={(value) =>
                  props.dispatch({
                    type: EventCreateActionType.UPDATE_RECURRENCE_TYPE,
                    payload: value as "weekly" | "monthly",
                  })
                }
                classNames={{
                  wrapper: cn("flex-row justify-start mt-3"),
                }}
              >
                <Radio value="weekly">Weekly</Radio>
                <Radio value="monthly">
                  {props.state.date
                    ? `Monthly on ${parseDateString(props.state.date).toLocaleDateString()}`
                    : `Monthly`}
                </Radio>
              </RadioGroup>
              <div className="text-red-400">
                {props.state.validationErrors.find((e) => e.fieldName === "recurrence")?.message}
              </div>
              {props.state.recurrencePattern?.recurrenceType === "weekly" && (
                <>
                  <CheckboxGroup
                    isRequired
                    className="flex-1 mt-5"
                    orientation="horizontal"
                    label="Select days"
                    value={props.state.recurrencePattern?.weeklyDays}
                    onValueChange={(value) =>
                      props.dispatch({ type: EventCreateActionType.UPDATE_WEEKLY_DAYS, payload: value as DayOfWeek[] })
                    }
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <Checkbox key={day} value={day.toLocaleLowerCase()}>
                        {day.slice(0, 3)}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                  <div className="flex-1 mt-5 xs:mt-0">
                    <Input
                      className="mt-5"
                      isRequired={props.state.recurrencePattern?.recurrenceType === "weekly"}
                      type="number"
                      min={1}
                      label="Repeat every"
                      value={String(props.state.recurrencePattern?.period || 1)}
                      onValueChange={(val) =>
                        props.dispatch({ type: EventCreateActionType.UPDATE_PERIOD_WEEKS, payload: parseInt(val) })
                      }
                      endContent={props.state.recurrencePattern?.period === 1 ? "week" : "weeks"}
                    />
                  </div>
                </>
              )}
            </div>
            <Input
              isRequired
              min={new Date().toISOString().split("T")[0]}
              className="mt-5"
              placeholder="1"
              type="date"
              label="End date"
              value={
                props.state.recurrencePattern?.endDate
                  ? createDateString(props.state.recurrencePattern?.endDate)
                  : undefined
              }
              onValueChange={(val) =>
                props.dispatch({
                  type: EventCreateActionType.UPDATE_RECURRENCE_END_DATE,
                  payload: parseDateString(val),
                })
              }
            />
            {Boolean(props.state.date) && currentDateWouldntBeIncluded && (
              <Checkbox
                className="mt-2"
                isSelected={props.state.recurrencePattern?.includeSelectedDate}
                onValueChange={(val) =>
                  props.dispatch({
                    type: EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE,
                    payload: val,
                  })
                }
              >
                <span className="text-sm">
                  Include selected date {parseDateString(props.state.date).toLocaleDateString()}?
                </span>
              </Checkbox>
            )}
            {showRecurrencePreview && Boolean(props.state.date) && (
              <Popover className="text-slate-900 w-full" placement="top-start" backdrop="blur" shouldFlip>
                <PopoverTrigger>
                  <span className="mt-5 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-3 py-2 flex flex-row justify-center rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                    Preview Recurrence Schedule
                  </span>
                </PopoverTrigger>
                <PopoverContent className="p-3">
                  <RecurrencePreview recurrentPattern={props.state.recurrencePattern as RecurrencePattern} />
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
