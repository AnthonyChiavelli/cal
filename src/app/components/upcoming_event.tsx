import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { pluralize } from "@/util/string";

interface IUpcomingEventProps {
  event: Event;
}

export default function UpcomingEvent(props: IUpcomingEventProps) {
  return (
    <div className="flex items-center py-3">
      <div className="text-1xl mx-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-slate-500">
        {props.event.classType === "GROUP" ? "G" : "P"}
      </div>
      <div className="grow border-b pb-2">
        <div className="text-sm">
          {props.event.classType === "GROUP" ? "Group" : "Private"} class from{" "}
          {dayjs(props.event.scheduledFor).format("MM/DD/YYYY")} to{" "}
          {dayjs(props.event.scheduledFor).format("MM/DD/YYYY")}
        </div>
        <div className="text-xs">{pluralize("student", Math.floor(Math.random() * 10), true)} scheduled</div>
      </div>
    </div>
  );
}
