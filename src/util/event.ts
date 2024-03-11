import { EventWithRelations } from "@/types";
import { toCapitalCase } from "./string";

/**
 * Returns a string to display on a calendar event
 *
 * @param event The event
 * @returns a string of the event name
 */
export function getEventName(event: EventWithRelations) {
  if (event.eventStudents.length === 0) {
    return `${toCapitalCase(event.classType)} (empty)`;
  }
  return event.eventStudents.map((es) => es.student.firstName).join(" | ");
}
