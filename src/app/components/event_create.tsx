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
} from "@nextui-org/react";
import { Student, UserSettings } from "@prisma/client";
import { createEvent } from "@/app/actions/event";
import { eventCreateReducer, EventCreateActionType, createInitialState } from "@/app/reducers/event_create";
import { parseDuration } from "@/util/calendar";
import Button from "./button";

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

  const presetDurationOptions = useMemo(() => ["1:00", "1:30", "2:00", "2:30"], []);
  const durationInMinutes = useMemo((): number | undefined => {
    return state.duration ? parseDuration(state.duration) : undefined;
  }, [state.duration]);
  const totalCost = useMemo(() => {
    return state.students.reduce((acc, s) => acc + Math.round((s.cost + Number.EPSILON) * 100) / 100, 0);
  }, [state.students]);

  const handleSubmit = useCallback(() => {
    if (state.eventType === "class") {
      createEvent({
        eventType: state.eventType,
        scheduledFor: state.date && state.time ? new Date(`${state.date}T${state.time}`) : new Date(),
        duration: durationInMinutes || 60,
        eventStudents: state.students.map((s) => ({ studentId: s.student.id, cost: s.cost })),
        notes: state.notes,
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
                            price, go to &apos;Settings&apos;. Your current base price is ${String(props.settings.basePrice)}.
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
            <fieldset className="xs:flex flex-row gap-3 space-y-3">
              <legend>Time</legend>
              <Input
                data-cy="scheduledForDate"
                name="scheduledForDate"
                type="date"
                label="Date"
                placeholder="1"
                value={state.date}
                onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_DATE, payload: val })}
              />
              <Input
                data-cy="scheduledForTime"
                name="scheduledForTime"
                type="time"
                label="Time"
                placeholder="1"
                value={state.time}
                onValueChange={(val) => dispatch({ type: EventCreateActionType.UPDATE_TIME, payload: val })}
              />
              <Autocomplete
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
