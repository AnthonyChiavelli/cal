"use client";

import { Key, useCallback, useMemo, useReducer } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  RadioGroup,
  Radio,
  cn,
  Textarea,
  Input,
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Switch,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { Student, UserSettings } from "@prisma/client";
import { createEvent } from "@/app/actions/event";
import { eventCreateReducer, EventCreateActionType, createInitialState } from "@/app/reducers/event_create";
import { DayOfWeek, RecurrencePattern } from "@/app/types";
import {
  compareDatesWithoutTime,
  createDateString,
  getDatesForRecurrencePattern,
  isCompleteRecurrencePattern,
  parseDateString,
  parseDuration,
} from "@/util/calendar";
import Button from "./button";
import RecurrencePreview from "./recurrence_preview";

// import RecurrencePreview from "./recurrence_preview";

interface IEventCreateProps {
  students: Student[];
  eventId?: string;
  settings: UserSettings;
  onCloseParentModal?: () => void;
  presetDate?: { date?: Date; time?: Date };
}

export default function EventCreate(props: IEventCreateProps) {
  const [state, dispatch] = useReducer(
    eventCreateReducer,
    createInitialState(props.presetDate, Number(props.settings.basePrice)),
  );

  const showRecurrencePreview = useMemo(
    () =>
      state.date &&
      state.recurrenceEnabled &&
      state.recurrencePattern?.endDate &&
      state.recurrencePattern?.period &&
      (state.recurrencePattern?.weeklyDays?.length || 0) > 0,

    [
      state.date,
      state.recurrenceEnabled,
      state.recurrencePattern?.endDate,
      state.recurrencePattern?.period,
      state.recurrencePattern?.weeklyDays?.length,
    ],
  );

  const presetDurationOptions = useMemo(() => ["1:00", "1:30", "2:00", "2:30"], []);
  const durationInMinutes = useMemo((): number | undefined => {
    return state.duration ? parseDuration(state.duration) : undefined;
  }, [state.duration]);
  const totalCost = useMemo(() => {
    return state.students.reduce((acc, s) => acc + Math.round((s.cost + Number.EPSILON) * 100) / 100, 0);
  }, [state.students]);

  const currentDateWouldntBeIncluded = useMemo(() => {
    if (isCompleteRecurrencePattern(state.recurrencePattern)) {
      const recurrenceDates = getDatesForRecurrencePattern({ ...state.recurrencePattern, includeSelectedDate: false });
      return !recurrenceDates.some((date) => compareDatesWithoutTime(date, parseDateString(state.date)) === 0);
    }
    return false;
  }, [state.date, state.recurrencePattern]);

  const handleSubmit = useCallback(() => {
    let errors = false;
    if (state.students.length === 0) {
      errors = true;
      dispatch({
        type: EventCreateActionType.SET_VALIDATION_ERRORS,
        payload: [{ fieldName: "students", message: "At least one student is required" }],
      });
    }
    if (state.recurrenceEnabled && state.recurrencePattern?.weeklyDays?.length === 0) {
      errors = true;
      dispatch({
        type: EventCreateActionType.SET_VALIDATION_ERRORS,
        payload: [{ fieldName: "recurrence", message: "At least one day is required" }],
      });
    }
    if (errors) {
      return;
    }
    if (state.eventType === "class") {
      const scheduledForDate = state.date && state.time ? parseDateString(`${state.date}T${state.time}`) : new Date();
      createEvent({
        eventType: state.eventType,
        scheduledFor: scheduledForDate,
        duration: durationInMinutes || 60,
        eventStudents: state.students.map((s) => ({ studentId: s.student.id, cost: s.cost })),
        notes: state.notes,
        recurrencePattern:
          state.recurrenceEnabled && isCompleteRecurrencePattern(state.recurrencePattern)
            ? (state.recurrencePattern as RecurrencePattern)
            : undefined,
      });
    }
  }, [state, durationInMinutes]);

  const renderClassForm = () => {
    return (
      // Form for class type event
      <>
        <Card>
          <CardBody>
            <fieldset>
              <legend>Students</legend>
              <div className="flex flex-col gap-2">
                {/* EventStudents */}
                {state.students.map(({ student, cost, costModified }) => (
                  <div key={student.id} className="flex flex-row items-center gap-2">
                    <div className="flex-[5]">{student.firstName}</div>
                    <Input
                      isRequired
                      className="flex-shrink-0 flex-grow-1 max-w-32"
                      name={`cost-${student.id}`}
                      value={cost.toFixed(2)}
                      onValueChange={(newCost: string) =>
                        dispatch({
                          type: EventCreateActionType.UPDATE_STUDENT_COST,
                          payload: { studentId: student.id, newCost },
                        })
                      }
                      type="number"
                      min="0"
                      label="$"
                      placeholder=""
                      labelPlacement="outside-left"
                      radius="none"
                      endContent={costModified ? "*" : undefined}
                      step={0.01}
                      required
                    />
                    <XMarkIcon
                      className="cursor-pointer"
                      width={20}
                      height={20}
                      onClick={() => dispatch({ type: EventCreateActionType.REMOVE_STUDENT, payload: student })}
                    />
                  </div>
                ))}
                <div className="text-red-400">
                  {state.validationErrors.find((e) => e.fieldName === "students")?.message}
                </div>
                {/* Price total */}
                {state.students.length > 0 && (
                  <div className="flex flex-row justify-between mt-5">
                    <div>Total</div>
                    <div className="flex flex-row">
                      <div className="font-bold" data-cy="event-total">
                        ${totalCost.toFixed(2)}
                      </div>
                      <Popover>
                        <PopoverTrigger>
                          <InformationCircleIcon className="cursor-pointer ml-3" width={20} height={20} />
                        </PopoverTrigger>
                        <PopoverContent className="p-5 text-black">
                          <p>
                            The total cost is calculated by multiplying the base price by the duration in hours, then
                            dividing it up among the number of students. Once a custom cost is set for a student, that
                            cost won&apos;t change as students are added or the duration is changed. To set the base
                            price, go to &apos;Settings&apos;. Your current base price is $
                            {String(props.settings.basePrice)}.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start mt-5">
                {/* Student search/add */}
                <Autocomplete
                  data-cy="student-autocomplete"
                  defaultItems={props.students}
                  shouldCloseOnBlur
                  label="Add student..."
                  placeholder="Search"
                  onSelectionChange={(key: Key) =>
                    dispatch({
                      type: EventCreateActionType.ADD_STUDENT,
                      payload: props.students.find((student) => student.id === key),
                    })
                  }
                >
                  {(student) => (
                    <AutocompleteItem
                      data-cy="student-autocomplete-option"
                      key={student.id}
                      className="text-black"
                      id={student.id}
                    >
                      {student.firstName}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </fieldset>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Textarea
              name="notes"
              label="Notes"
              value={state.notes}
              onValueChange={(newVal) => dispatch({ type: EventCreateActionType.UPDATE_NOTES, payload: newVal })}
            />
          </CardBody>
        </Card>
      </>
    );
  };

  const renderConsultationForm = () => {
    return (
      <>
        <Card>
          <CardBody>consult</CardBody>
        </Card>
      </>
    );
  };

  return (
    <form action={handleSubmit} className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
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
                value={state.date}
                onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_DATE, payload: val })}
              />
              <Input
                isRequired
                data-cy="scheduledForTime"
                name="scheduledForTime"
                type="time"
                label="Time"
                placeholder="1"
                value={state.time}
                onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_TIME, payload: val })}
              />
              <Autocomplete
                isRequired
                data-cy="duration"
                allowsCustomValue
                label="Duration"
                placeholder="Duration"
                onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_DURATION, payload: val })}
                onSelectionChange={(val) =>
                  dispatch({ type: EventCreateActionType.UPDATE_DURATION, payload: String(val) })
                }
                value={state.duration}
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
        <Card>
          <CardBody>
            {/* Recurrence Settings */}
            <Switch
              onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED, payload: val })}
            >
              Recurring?
            </Switch>
            {state.recurrenceEnabled && (
              <>
                <div>
                  <RadioGroup
                    name="eventType"
                    value={state.recurrencePattern?.recurrenceType || "weekly"}
                    onValueChange={(value) =>
                      dispatch({
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
                      {state.date ? `Monthly on ${parseDateString(state.date).toLocaleDateString()}` : `Monthly`}
                    </Radio>
                  </RadioGroup>
                  <div className="text-red-400">
                    {state.validationErrors.find((e) => e.fieldName === "recurrence")?.message}
                  </div>
                  {state.recurrencePattern?.recurrenceType === "weekly" && (
                    <>
                      <CheckboxGroup
                        isRequired
                        className="flex-1 mt-5"
                        orientation="horizontal"
                        label="Select days"
                        value={state.recurrencePattern?.weeklyDays}
                        onValueChange={(value) =>
                          dispatch({ type: EventCreateActionType.UPDATE_WEEKLY_DAYS, payload: value as DayOfWeek[] })
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
                          isRequired={state.recurrencePattern?.recurrenceType === "weekly"}
                          type="number"
                          min={1}
                          label="Repeat every"
                          value={String(state.recurrencePattern?.period || 1)}
                          onValueChange={(val) =>
                            dispatch({ type: EventCreateActionType.UPDATE_PERIOD_WEEKS, payload: parseInt(val) })
                          }
                          endContent={state.recurrencePattern?.period === 1 ? "week" : "weeks"}
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
                    state.recurrencePattern?.endDate ? createDateString(state.recurrencePattern?.endDate) : undefined
                  }
                  onValueChange={(val) =>
                    dispatch({ type: EventCreateActionType.UPDATE_RECURRENCE_END_DATE, payload: parseDateString(val) })
                  }
                />
                {Boolean(state.date) && currentDateWouldntBeIncluded && (
                  <Checkbox
                    className="mt-2"
                    isSelected={state.recurrencePattern?.includeSelectedDate}
                    onValueChange={(val) =>
                      dispatch({
                        type: EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE,
                        payload: val,
                      })
                    }
                  >
                    <span className="text-sm">
                      Include selected date {parseDateString(state.date).toLocaleDateString()}?
                    </span>
                  </Checkbox>
                )}
                {showRecurrencePreview && Boolean(state.date) && (
                  <Popover className="text-slate-900 w-full" placement="top-start" backdrop="blur" shouldFlip>
                    <PopoverTrigger>
                      <span className="mt-5 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-3 py-2 flex flex-row justify-center rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                        Preview Recurrence Schedule
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="p-3">
                      <RecurrencePreview recurrentPattern={state.recurrencePattern as RecurrencePattern} />
                    </PopoverContent>
                  </Popover>
                )}
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <RadioGroup
              name="eventType"
              value={state.eventType}
              onValueChange={(value) =>
                dispatch({ type: EventCreateActionType.UPDATE_EVENT_TYPE, payload: value as "class" | "consultation" })
              }
              classNames={{
                wrapper: cn("flex-row xs:flex-col justify-around"),
              }}
            >
              <Radio value="class">Class</Radio>
              <Radio value="consultation">Consultation</Radio>
            </RadioGroup>
          </CardBody>
        </Card>

        {state.eventType === "class" && renderClassForm()}
        {state.eventType === "consultation" && renderConsultationForm()}
      </div>
      <div className="flex flex-col gap-3 justify-end pt-5">
        <Button
          type="submit"
          text={props.eventId ? `Edit ${state.eventType}` : `Create ${state.eventType}`}
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
    </form>
  );
}
