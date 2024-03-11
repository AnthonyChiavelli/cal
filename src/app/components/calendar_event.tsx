"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { markEventCompleted } from "../actions/events";
import { EventStudent, Event, Student } from "@prisma/client";
import Link from "next/link";

interface ICalendarEventProps {
  event: Event & {
    eventStudents: Array<EventStudent & { student: Student }>;
  };
}

export default function CalendarEvent(props: ICalendarEventProps) {
  const [eventCompleted, setEventCompleted] = useState(props.event.completed);

  const timeRangeLabel = `${props.event.scheduledFor.getHours() % 12}:${props.event.scheduledFor.getMinutes().toString().padStart(2, "0")} - ${(props.event.scheduledFor.getHours() + Math.floor(props.event.durationMinutes / 60)) % 12}:${(props.event.scheduledFor.getMinutes() + (props.event.durationMinutes % 60)).toString().padStart(2, "0")} ${props.event.scheduledFor.getHours() + Math.floor(props.event.durationMinutes / 60) > 11 ? "PM" : "AM"}`;
  const eventDisplayName = useMemo(
    () => props.event.eventStudents.map((es) => es.student.firstName).join(" | "),
    [props.event.eventStudents],
  );

  const handleMarkCompleted = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const result = await markEventCompleted(props.event, !eventCompleted);
      setEventCompleted(result.completed);
      toast.success("Event updated");
    } catch (e) {
      toast.error("Failed to mark event as completed");
    }
  };
  return (
    <Link
      href={"/app/schedule/" + props.event.id}
      className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
    >
      <div className="flex flex-row justify-between">
        <p className="font-semibold text-blue-700 truncate">{eventDisplayName}</p>
        <div className="text-md text-blue-700 font-semibold flex flex-row gap-2" onClick={handleMarkCompleted}>
          Completed? <input type="checkbox" checked={eventCompleted} />
        </div>
      </div>
      <p className="text-blue-500 group-hover:text-blue-700">
        <time dateTime={props.event.scheduledFor.toDateString()}>{timeRangeLabel}</time>
      </p>
    </Link>
  );
}
