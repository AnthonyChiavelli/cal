import { Dispatch, Key, useMemo } from "react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Autocomplete,
  AutocompleteItem,
  Card,
  CardBody,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { Student } from "@prisma/client";
import { EventCreateAction, EventCreateActionType, IEventCreateState } from "@/app/reducers/event_create";

interface IEventCreateNotesProps {
  state: IEventCreateState;
  students: Student[];
  basePrice: number;
  dispatch: Dispatch<EventCreateAction>;
}

export default function EventCreateFormEventType(props: IEventCreateNotesProps) {
  const totalCost = useMemo(() => {
    return props.state.students.reduce((acc, s) => acc + Math.round((s.cost + Number.EPSILON) * 100) / 100, 0);
  }, [props.state.students]);

  return (
    <Card>
      <CardBody>
        <fieldset>
          <legend>Students</legend>
          <div className="flex flex-col gap-2">
            {props.state.students.map(({ student, cost, costModified }) => (
              <div key={student.id} className="flex flex-row items-center gap-2" data-cy={`row-${student.firstName}`}>
                <div className="flex-[5]">{student.firstName}</div>
                <Input
                  isRequired
                  className="flex-shrink-0 flex-grow-1 max-w-32"
                  name={`cost-${student.id}`}
                  value={cost.toString()}
                  onValueChange={(newCost: string) =>
                    props.dispatch({
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
                  className="cursor-pointer remove-student"
                  width={20}
                  height={20}
                  onClick={() => props.dispatch({ type: EventCreateActionType.REMOVE_STUDENT, payload: student })}
                />
              </div>
            ))}
            <div className="text-red-400">
              {props.state.validationErrors.find((e) => e.fieldName === "students")?.message}
            </div>
            {/* Price total */}
            {props.state.students.length > 0 && (
              <div className="flex flex-row justify-between mt-5">
                <div>Total</div>
                <div className="flex flex-row">
                  <div className="font-bold" data-cy="event-total">
                    {Number.isNaN(totalCost) ? "0.00" : `$${totalCost.toFixed(2)}`}
                  </div>
                  <Popover>
                    <PopoverTrigger>
                      <InformationCircleIcon className="cursor-pointer ml-3" width={20} height={20} />
                    </PopoverTrigger>
                    <PopoverContent className="p-5 text-black">
                      <p>
                        The total cost is calculated by multiplying the base price by the duration in hours, then
                        dividing it up among the number of students. Once a custom cost is set for a student, that cost
                        won&apos;t change as students are added or the duration is changed. To set the base price, go to
                        &apos;Settings&apos;. Your current base price is ${String(props.basePrice)}.
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
                props.dispatch({
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
  );
}
