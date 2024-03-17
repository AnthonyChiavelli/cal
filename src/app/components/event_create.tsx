"use client";

import { useCallback, useMemo, useState } from "react";
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
import { parseDuration } from "@/util/calendar";
import Button from "./button";

interface IEventCreateProps {
  students: Student[];
  eventId?: string;
  settings: UserSettings;
  onCloseParentModal?: () => void;
}

type SelectedStudent = {
  student: Student;
  cost: number;
  costModified?: boolean;
};

export default function EventCreate(props: IEventCreateProps) {
  // TODO use reducer?
  const [eventType, setEventType] = useState("class");
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
  const [durationValidationError, setDurationValidationError] = useState<string | undefined>();
  const [duration, setDuration] = useState<string | undefined>();

  const presetDurationOptions = useMemo(() => ["1:00", "1:30", "2:00", "2:30"], []);

  const durationInMinutes = useMemo((): number => {
    if (duration) {
      return parseDuration(duration);
    }
  }, [duration]);

  const totalCost = useMemo(() => {
    return selectedStudents.reduce((acc, s) => acc + s.cost, 0);
  }, [selectedStudents]);

  const handleDurationChange = useCallback(
    (value: string) => {
      try {
        const minutes = parseDuration(value);
        setDuration(value);
        setDurationValidationError(undefined);

        // Recalculate the student costs
        const defaultHourlyPrice = Number(props.settings.basePrice) * (minutes / 60);
        const individualHourlyPrice = defaultHourlyPrice / selectedStudents.length;
        const roundedPrice = Number(individualHourlyPrice.toFixed(2));
        const adjustedStudents = selectedStudents.map((s) => ({ ...s, cost: s.costModified ? s.cost : roundedPrice }));
        setSelectedStudents(adjustedStudents);
      } catch (e) {
        setDurationValidationError(e.message);
      }
    },
    [props.settings.basePrice, selectedStudents],
  );

  const handleStudentSelected = useCallback(
    (studentId: string) => {
      const newSelectedStudent = props.students.find((student) => student.id === studentId);
      if (newSelectedStudent && !selectedStudents.find((s) => s.student.id === newSelectedStudent.id)) {
        // Calculate the student cost by multiplying the base price by the duration in hours, then divying it up among the number of students
        const defaultHourlyPrice = Number(props.settings.basePrice) * (durationInMinutes ? durationInMinutes / 60 : 1);
        const individualHourlyPrice = defaultHourlyPrice / (selectedStudents.length + 1);
        const roundedPrice = Number(individualHourlyPrice.toFixed(2));

        // Modify the price of the other students to be equal (but don't touch students who have had their price manually modified)
        const adjustedOtherStudents = selectedStudents.map((s) => ({
          ...s,
          cost: s.costModified ? s.cost : roundedPrice,
        }));
        setSelectedStudents([...adjustedOtherStudents, { student: newSelectedStudent, cost: roundedPrice }]);
      }
    },
    [durationInMinutes, props.settings.basePrice, props.students, selectedStudents],
  );

  const handleRemoveStudent = useCallback(
    (student: Student) => {
      const newSelectedStudents = selectedStudents.filter((s) => s.student.id !== student.id);
      // Recalculate the student costs
      const defaultHourlyPrice = Number(props.settings.basePrice) * (durationInMinutes / 60);
      const individualHourlyPrice = defaultHourlyPrice / newSelectedStudents.length;
      const roundedPrice = Number(individualHourlyPrice.toFixed(2));
      const adjustedStudents = newSelectedStudents.map((s) => ({ ...s, cost: s.costModified ? s.cost : roundedPrice }));
      setSelectedStudents(adjustedStudents);
    },
    [durationInMinutes, props.settings.basePrice, selectedStudents],
  );

  const handleChangeStudentCost = (student: Student, newCostValue: String) => {
    const newSelectedStudents = selectedStudents.map((s) => {
      if (s.student.id === student.id) {
        return { ...s, cost: Number(newCostValue), costModified: false };
      } else {
        return s;
      }
    });
    setSelectedStudents(newSelectedStudents);
  };

  const renderClassForm = () => {
    return (
      <>
        <Card>
          <CardBody>
            <fieldset>
              <legend>Students</legend>
              <div className="flex flex-col gap-2">
                {selectedStudents.map(({ student, cost }) => (
                  <div key={student.id} className="flex flex-row items-center gap-2">
                    <div className="flex-[5]">{student.firstName}</div>
                    <input type="hidden" name="student" value={student.id} />
                    <Input
                      className="flex-shrink-0 flex-grow-1 max-w-32"
                      name={`cost-${student.id}`}
                      value={String(cost)}
                      onValueChange={(newValue: string) => handleChangeStudentCost(student, newValue)}
                      type="number"
                      min="0"
                      label="$"
                      placeholder=""
                      labelPlacement="outside-left"
                      radius="none"
                    />
                    <XMarkIcon
                      className="cursor-pointer"
                      width={20}
                      height={20}
                      onClick={() => handleRemoveStudent(student)}
                    />
                  </div>
                ))}
                {selectedStudents.length > 0 && (
                  <div className="flex flex-row justify-between mt-5">
                    <div>Total</div>
                    <div className="flex flex-row">
                      <div className="font-bold">${totalCost.toFixed(2)}</div>
                      <Popover>
                        <PopoverTrigger>
                          <InformationCircleIcon className="cursor-pointer ml-3" width={20} height={20} />
                        </PopoverTrigger>
                        <PopoverContent className="p-3 text-black">
                          <p>
                            The total cost is calculated by multiplying the base price by the duration in hours, then
                            dividing it up among the number of students. Once a custom cost is set for a student, that
                            cost won&apos;t change as students are added or the duration is changed. To set the base
                            price, go to &apos;Settings&apos;
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start mt-5">
                <Autocomplete
                  defaultItems={props.students}
                  shouldCloseOnBlur
                  label="Add student..."
                  placeholder="Search"
                  onSelectionChange={handleStudentSelected}
                >
                  {(student) => (
                    <AutocompleteItem key={student.id} className="text-black" id={student.id}>
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
            <Textarea name="notes" label="Notes" />
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
    <form action={createEvent} className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <Card>
          <CardBody>
            <fieldset className="xs:flex flex-row gap-3 space-y-3">
              <legend>Time</legend>
              <Input name="scheduledForDate" type="date" label="Date" placeholder="1" />
              <Input name="scheduledForTime" type="time" label="Time" placeholder="1" />
              <Autocomplete
                allowsCustomValue
                label="Duration"
                placeholder="Duration"
                onValueChange={handleDurationChange}
                onSelectionChange={handleDurationChange}
                value={duration}
                isInvalid={!!durationValidationError}
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
              value={eventType}
              onValueChange={(value) => setEventType(value)}
              classNames={{
                wrapper: cn("flex-row xs:flex-col justify-around"),
              }}
            >
              <Radio value="class">Class</Radio>
              <Radio value="consultation">Consultation</Radio>
            </RadioGroup>
          </CardBody>
        </Card>

        {eventType === "class" && renderClassForm()}
        {eventType === "consultation" && renderConsultationForm()}
      </div>
      <div className="flex flex-col gap-3 justify-end">
        <Button type="submit" text={props.eventId ? `Edit ${eventType}` : `Create ${eventType}`} flavor="primary" />
        {props.onCloseParentModal && (
          <Button type="button" text="Cancel" flavor="secondary" onClick={props.onCloseParentModal} />
        )}
      </div>
    </form>
  );
}
