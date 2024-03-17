import { ClockIcon, PlusCircleIcon, ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { CalendarDay } from "@/types";

interface IMonthCalendarMiniDayProps {
  day: CalendarDay;
  addEvent: (day: CalendarDay) => void;
}

export default function MonthCalendarMiniDay(props: IMonthCalendarMiniDayProps) {
  return (
    <div className="px-4 py-10 sm:px-6 lg:hidden">
      <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
        {props.day.events.map((event) => (
          <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
            <div className="flex-auto">
              <p className="font-semibold text-gray-900">{event.name}</p>
              <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                {event.time}
              </time>
            </div>
            <Link
              href={event.href}
              className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
            >
              Edit<span className="sr-only">, {event.name}</span>
            </Link>
          </li>
        ))}
        <Link href={`?p=day&t=${props.day.date}`}>
          <li
            className="flex flex-row justify-center items-center cursor-pointer p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
            onClick={() => props.addEvent(props.day)}
          >
            Go to day
            <ArrowUpRightIcon className="ml-1 h-6 w-6 text-green-600 cursor-pointer" />
          </li>
        </Link>
        <li
          className="flex flex-row justify-center items-center cursor-pointer p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
          onClick={() => props.addEvent(props.day)}
        >
          Add event
          <PlusCircleIcon className="ml-1 h-6 w-6 text-blue-400 cursor-pointer" />
          {/* TODO open with correct date */}
        </li>
      </ol>
    </div>
  );
}
