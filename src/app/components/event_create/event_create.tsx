"use client";

import { useCallback, useReducer } from "react";
import { toast } from "react-toastify";
import { ClassType, EventType, Student, UserSettings } from "@prisma/client";
import { createEvent } from "@/app/actions/event";
import EventCreateFormButtons from "@/app/components/event_create/form_components/event_create_form_buttons";
import EventCreateFormEventType from "@/app/components/event_create/form_components/event_create_form_event_type";
import EventCreateNotes from "@/app/components/event_create/form_components/event_create_form_notes";
import EventCreateFormRecurrence from "@/app/components/event_create/form_components/event_create_form_recurrence";
import EventCreateFormStudents from "@/app/components/event_create/form_components/event_create_form_students";
import EventCreateFormTime from "@/app/components/event_create/form_components/event_create_form_time";
import { eventCreateReducer, EventCreateActionType, createInitialState } from "@/app/reducers/event_create";
import { RecurrencePattern } from "@/app/types";
import { isCompleteRecurrencePattern, parseDuration } from "@/util/calendar";
import { useOnMount } from "@/util/hooks";

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

  useOnMount(() => {
    if (props.presetDate) {
      const newDate = props.presetDate.date?.toISOString().split("T")[0];
      if (newDate) {
        dispatch({ type: EventCreateActionType.UPDATE_DATE, payload: newDate });
      }
    }
  });

  const handleSubmit = useCallback(async () => {
    let errors = false;
    if (state.eventType === EventType.CLASS && state.students.length === 0) {
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
    if (state.eventType) {
      const scheduledForDate = state.date && state.time ? new Date(`${state.date}T${state.time}`) : new Date();
      try {
        await createEvent({
          eventType: state.eventType,
          classType: ClassType.GROUP,
          scheduledFor: scheduledForDate,
          duration: state.duration ? parseDuration(state.duration) : 60,
          eventStudents: state.students.map((s) => ({ studentId: s.student.id, cost: s.cost })),
          notes: state.notes,
          recurrencePattern:
            state.recurrenceEnabled && isCompleteRecurrencePattern(state.recurrencePattern)
              ? (state.recurrencePattern as RecurrencePattern)
              : undefined,
        });
      } catch (e) {
        toast.error("An error occurred while creating the event. Please try again later.");
      }
    }
  }, [state]);

  return (
    <form action={handleSubmit} className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        {state.eventType === EventType.CLASS && (
          <>
            <EventCreateFormEventType state={state} dispatch={dispatch} />
            <EventCreateFormTime state={state} dispatch={dispatch} />
            <EventCreateFormRecurrence state={state} dispatch={dispatch} />
            <EventCreateFormStudents
              students={props.students}
              state={state}
              dispatch={dispatch}
              basePrice={Number(props.settings.basePrice)}
            />
            <EventCreateNotes state={state} dispatch={dispatch} />
          </>
        )}
        {state.eventType === EventType.CONSULTATION && (
          <>
            <EventCreateFormEventType state={state} dispatch={dispatch} />
            <EventCreateFormTime state={state} dispatch={dispatch} />
            <EventCreateNotes state={state} dispatch={dispatch} />
          </>
        )}
      </div>

      <EventCreateFormButtons
        state={state}
        dispatch={dispatch}
        eventId={props.eventId}
        onCloseParentModal={props.onCloseParentModal}
      />
    </form>
  );
}
