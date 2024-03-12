"use client";

import { useTransition } from "react";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "@nextui-org/react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CalenderOverflowMenu from "@/app/components/calendar_overflow_menu";
import CalendarViewMenu from "@/app/components/calendar_view_menu";
import LoadingPane from "@/app/components/loading_pane";
import MonthCalendarMiniDay from "@/app/components/month_calendar_mini_day";
import MonthViewMiniCalendar from "@/app/components/month_view_mini_calendar";
import { CalendarDay } from "@/types";
import { createMonthString, getAdjacentMonthString, parseMonthString } from "@/util/calendar";

interface IMonthCalendar {
  monthString?: string;
  calendarDays: CalendarDay[];
  showMiniDayView: boolean;
}

export default function MonthCalendar(props: IMonthCalendar) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDay, setSelectedDay] = React.useState<CalendarDay | null>(props.calendarDays[0] || null);

  const goToPreviousMonth = () => {
    startTransition(() => {
      router.push(`?p=month&t=${getAdjacentMonthString(props.monthString || "", -1)}`);
    });
  };

  const goToCurrentMonth = () => {
    startTransition(() => {
      router.push(`?p=month&t=${createMonthString(new Date().getFullYear(), new Date().getMonth() + 1)}`);
    });
  };

  const goToNextMonth = () => {
    startTransition(() => {
      router.push(`?p=month&t=${getAdjacentMonthString(props.monthString || "", 1)}`);
    });
  };

  const isCurrentMonth = React.useMemo(() => {
    const [year, month] = parseMonthString(props.monthString);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    return year === currentYear && month === currentMonth;
  }, [props.monthString]);

  const handleClickMiniMonthDay = React.useCallback(
    (day: CalendarDay) => {
      if (props.showMiniDayView) {
        setSelectedDay(day);
      } else {
        router.push(`?p=day&t=${day.date}`);
      }
    },
    [props.showMiniDayView, router],
  );

  const [year, month] = React.useMemo((): [number, number] => {
    try {
      return parseMonthString(props.monthString);
    } catch {
      return [new Date().getFullYear(), new Date().getMonth() + 1];
    }
  }, [props.monthString]);

  const calendarDays = props.calendarDays;

  const displayDate = React.useMemo((): string => {
    const monthName = new Date(year, month - 1).toLocaleString("en-us", { month: "long" });
    return `${monthName} ${year}`;
  }, [month, year]);

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            <time dateTime={`${year}-${month}`}>{displayDate}</time>
            <div className={classNames("text-sm font-normal", { invisible: !isCurrentMonth })}>(Current month)</div>
          </h1>
        </div>
        <div className="flex items-center">
          <div className="relative flex rounded-md bg-white shadow-sm items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={() => goToPreviousMonth()}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex items-center content-center border-y border border-gray-300 pr-1">
              <button
                onClick={() => goToCurrentMonth()}
                type="button"
                className="px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative"
              >
                Today
              </button>
            </div>
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={() => goToNextMonth()}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <CalendarViewMenu timePeriod="month" />
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Link href="/app/schedule/add">
              <button
                type="button"
                className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add event
              </button>
            </Link>
          </div>
          <CalenderOverflowMenu />
        </div>
      </header>

      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col relative">
        {isPending && <LoadingPane />}
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="bg-white py-2">
              {day.charAt(0)}
              <span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
            </div>
          ))}
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "relative px-3 py-2",
                )}
              >
                <Link href={`?p=day&t=${day.date}`}>
                  <time
                    dateTime={day.date}
                    className={
                      day.isToday
                        ? "flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white"
                        : "text-black"
                    }
                  >
                    {day.date.split("-").pop()?.replace(/^0/, "")}
                  </time>
                </Link>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <Tooltip
                          content={
                            <div className="text-gray-900">
                              <div className="text-md font-bold">{event.name}</div>
                              <div className="text-sm">{event.datetime}</div>
                            </div>
                          }
                          placement="top"
                        >
                          <a href={event.href} className="group flex">
                            <p className="flex-auto truncate font-small text-gray-900 group-hover:text-indigo-600">
                              {event.name}
                            </p>
                            <time
                              dateTime={event.datetime}
                              className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                            >
                              {event.time}
                            </time>
                          </a>
                        </Tooltip>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-gray-500">
                        <Link href={`?p=day&t=${day.date}`}>+ {day.events.length - 2} more</Link>
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <MonthViewMiniCalendar onSelectDay={handleClickMiniMonthDay} calendarDays={calendarDays} />
        </div>
      </div>
      {selectedDay && selectedDay.events.length > 0 && <MonthCalendarMiniDay day={selectedDay} />}
    </div>
  );
}
