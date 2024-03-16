"use client";

import classNames from "classnames";
import { CalendarDay } from "@/types";

interface IMonthViewMiniCalendarProps {
  calendarDays: CalendarDay[];
  onSelectDay: (day: CalendarDay) => void;
  selectedDay: CalendarDay;
}

export default function MonthViewMiniCalendar(props: IMonthViewMiniCalendarProps) {
  return (
    <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
      {props.calendarDays.map((day) => {
        const isSelected = day.date === props.selectedDay.date;
        return (
          <button
            key={day.date}
            type="button"
            onClick={() => props.onSelectDay(day)}
            className={classNames(
              day.isCurrentMonth ? "bg-white" : "bg-gray-50",
              (isSelected || day.isToday) && "font-semibold",
              isSelected && "text-white",
              !isSelected && day.isToday && "text-indigo-600",
              !isSelected && day.isCurrentMonth && !day.isToday && "text-gray-900",
              !isSelected && !day.isCurrentMonth && !day.isToday && "text-gray-500",
              "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10 border-blue-400",
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                isSelected && "flex h-6 w-6 items-center justify-center rounded-full",
                isSelected && day.isToday && "bg-indigo-600 font-bold",
                isSelected && !day.isToday && "bg-gray-900",
                "ml-auto",
              )}
            >
              {day.date.split("-").pop()?.replace(/^0/, "")}
            </time>
            <span className="sr-only">{day.events.length} events</span>
            {day.events.length > 0 && (
              <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                {day.events.map((event) => (
                  <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                ))}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
