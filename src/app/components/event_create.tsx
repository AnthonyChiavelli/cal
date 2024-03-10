"use client";

import { Student } from "@prisma/client";
import { RadioGroup, Radio, cn, Textarea } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Input } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { createEvent } from "../actions/events";
import Button from "./button";
import { useState } from "react";
import EventCreateModal from "./event_create_modal";

interface IEventCreateProps {
  students: Student[];
}

type SelectedStudent = {
  student: Student;
  cost: number;
};

export default function EventCreate(props: IEventCreateProps) {
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("class");

  const handleStudentSelected = (studentId: any) => {
    const newSelectedStudent = props.students.find((student) => student.id === studentId);
    // TODO prevent dupes
    if (newSelectedStudent) {
      setSelectedStudents([...selectedStudents, { student: newSelectedStudent, cost: 0 }]);
    }
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
                      type="number"
                      min="0"
                      label="Cost"
                      placeholder=""
                      labelPlacement="outside-left"
                      radius="none"
                    />
                    <XMarkIcon
                      className="cursor-pointer"
                      width={20}
                      height={20}
                      onClick={() => setSelectedStudents(selectedStudents.filter((s) => s.student.id !== student.id))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start mt-5">
                <Autocomplete
                  defaultItems={props.students}
                  label="Add student..."
                  placeholder="Search"
                  className="max-w-xs"
                  onSelectionChange={handleStudentSelected}
                >
                  {(student) => (
                    <AutocompleteItem key={student.id} id={student.id}>
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
    <div>
      <form action={createEvent} className="flex flex-col gap-5">
        <Card>
          <CardBody>
            <fieldset className="xs:flex flex-row gap-3 space-y-3">
              <legend>Time</legend>
              <Input name="scheduledForDate" type="date" label="Date" placeholder="1" />
              <Input name="scheduledForTime" type="time" label="Time" placeholder="1" />
              <Input name="duration" type="number" min="0" label="Duration" placeholder="" />
            </fieldset>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <RadioGroup
              // orientation="horizontal"
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

        <Button type="submit" text={`Create ${eventType}`} flavor="pizzaz" />
      </form>

      <Button text="Create Event" flavor="primary" onClick={() => setShowModal(true)} />
      <EventCreateModal
        presetDate={new Date()}
        students={props.students}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
