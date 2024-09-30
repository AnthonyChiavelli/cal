"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getDateNMinutesLater } from "../../util/calendar";
import { EventStudent, Event, Student } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { markEventCompleted } from "@/app/actions/event";
import ConfirmationModal from "@/app/components/confirmation_modal";

interface ICalendarEventProps {
  event: Event & {
    eventStudents: Array<EventStudent & { student: Student }>;
  };
  compact?: boolean;
}

export default function CalendarEvent(props: ICalendarEventProps) {
  const [eventCompleted, setEventCompleted] = useState(props.event.completed);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const timeRangeLabel = `${props.event.scheduledFor.getHours() % 12}:${props.event.scheduledFor.getMinutes().toString().padStart(2, "0")} - ${(props.event.scheduledFor.getHours() + Math.floor(props.event.durationMinutes / 60)) % 12}:${(props.event.scheduledFor.getMinutes() + (props.event.durationMinutes % 60)).toString().padStart(2, "0")} ${props.event.scheduledFor.getHours() + Math.floor(props.event.durationMinutes / 60) > 11 ? "PM" : "AM"}`;
  const eventDisplayName = useMemo(
    () => props.event.eventStudents.map((es) => es.student.firstName).join(" | "),
    [props.event.eventStudents],
  );

  const handleMarkCompleted = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (eventCompleted) {
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmMarkCompleted = async () => {
    setShowConfirmationModal(false);
    try {
      const result = await markEventCompleted(props.event.id, !eventCompleted);
      setEventCompleted(result.completed);
      toast.success("Event updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to mark event as completed");
    }
  };

  const eventColors = React.useMemo((): string => {
    if (props.event.cancelledAt) {
      return "bg-gray-100 hover:bg-gray-200 text-blue-500";
    } else if (getDateNMinutesLater(props.event.scheduledFor, props.event.durationMinutes) < new Date()) {
      return "bg-amber-200 hover:bg-amber-300 text-blue-500";
    } else {
      return "bg-sky-100 hover:bg-sky-200 text-blue-500";
    }
  }, [props.event.cancelledAt, props.event.durationMinutes, props.event.scheduledFor]);

  return (
    <Link
      data-cy={`calendar-event`}
      href={"/app/schedule/" + props.event.id}
      className={classNames(
        "@container group absolute inset-1 flex flex-col rounded-lg p-2 text-xs leading-5 overflow-x-hidden overflow-y-auto",
        eventColors,
      )}
    >
      <div className="flex flex-row justify-between flex-wrap">
        <p className={classNames("font-semibold truncate", { "line-through": props.event.cancelledAt })}>
          {eventDisplayName}
        </p>
        <div className="text-md font-semibold flex flex-row gap-2" onClick={handleMarkCompleted}>
          <span className="hidden @[160px]:block">Completed?</span>
          <input
            className={classNames({ hidden: props.event.cancelledAt })}
            type="checkbox"
            checked={eventCompleted}
            disabled={eventCompleted}
            readOnly
          />
        </div>
      </div>
      <p className="group-hover:text-blue-700">
        <time dateTime={props.event.scheduledFor.toDateString()}>{timeRangeLabel}</time>
      </p>
      <ConfirmationModal
        message="Mark this event as completed? Client will be charged"
        open={showConfirmationModal}
        onAccept={handleConfirmMarkCompleted}
        onDeny={() => setShowConfirmationModal(false)}
      />
    </Link>
  );
}
