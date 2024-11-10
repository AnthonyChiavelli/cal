import { EventStudentWithRelations } from "@/types";
import { pluralize } from "@/util/string";

interface IEventChargesListProps {
  eventStudents: EventStudentWithRelations[];
  eventStudentsIncludedInInvoice: EventStudentWithRelations[];
  onToggleEvent: (event: EventStudentWithRelations) => void;
}

export default function EventChargesList(props: IEventChargesListProps) {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <td>Student</td>
            <td>Date</td>
            <td>Duration</td>
            <td>Charge</td>
            <td>Include?</td>
          </tr>
        </thead>
        <tbody>
          {props.eventStudents.map((event) => (
            <tr key={event.id}>
              <td>
                {event.student.firstName} {event.student.lastName}
              </td>
              <td>{event.event.scheduledFor.toDateString()}</td>
              <td>{pluralize("min", event.event.durationMinutes, true)}</td>
              <td>${event.cost.toString()}</td>
              <td>
                <input
                  className="checkbox"
                  checked={props.eventStudentsIncludedInInvoice.find((ei) => ei.id === event.id) !== undefined}
                  onChange={() => props.onToggleEvent(event)}
                  type="checkbox"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
