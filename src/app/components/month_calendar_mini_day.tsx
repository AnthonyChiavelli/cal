import { ClockIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { CalendarDay } from "@/types";
import Button from "./button";

interface IMonthCalendarMiniDayProps {
  day: CalendarDay;
  addEvent: (day: CalendarDay) => void;
}

export default function MonthCalendarMiniDay(props: IMonthCalendarMiniDayProps) {
  return (
    <div className="px-4 py-10 sm:px-6 lg:hidden">
      <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
        <div className="flex flex-col items-center p-3 text-lg font-bold">
          {new Date(props.day.date).toLocaleDateString()}
        </div>
        {props.day.events.map((event) => (
          <Link href={event.href} key={event.id}>
            <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
              <div className="flex-auto">
                <p className="font-semibold text-gray-900">{event.name}</p>
                <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                  <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  {event.time}
                </time>
              </div>
            </li>
          </Link>
        ))}
        {props.day.events.length === 0 && <div className="p-4 pr-6 text-center text-gray-500">No events</div>}
        <div className="flex flex-col items-center justify-around gap-3 p-2 xs:flex-row">
          <Link href={`?p=day&t=${props.day.date}`}>
            <Button text="Go to day" flavor="primary" iconName="ArrowUpRightIcon" />
          </Link>

          <Button
            text="Add event"
            flavor="primary"
            iconName="PlusCircleIcon"
            onClick={() => props.addEvent(props.day)}
          />
        </div>
      </ol>
    </div>
  );
}
