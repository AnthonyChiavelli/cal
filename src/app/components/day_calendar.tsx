"use client";

import { useEffect, useRef } from "react";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Student, UserSettings } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { CalendarDay, EventWithRelations } from "@/types";
import { createDateString, getAdjacentDateString, splitDateString } from "@/util/calendar";
import CalendarEvent from "./calendar_event";
import CalenderOverflowMenu from "./calendar_overflow_menu";
import CalendarViewMenu from "./calendar_view_menu";
import EventCreateModal from "./event_create_modal";
import MiniMonthCalendar from "./mini_month_calendar";

interface IDateCalendarProps {
  dateString?: string;
  events: EventWithRelations[];
  daysForMiniCalendar: CalendarDay[];
  settings: UserSettings;
  showMiniCalendar: boolean;
  students: Student[];
  condensed?: boolean;
}

export default function DayCalendar(props: IDateCalendarProps) {
  const [createEventModalOpen, setCreateEventModalOpen] = React.useState(false);
  const [createModalPresetDate, setCreateModalPresetDate] = React.useState<{ date?: Date; time?: Date } | undefined>(
    undefined,
  );

  const [year, month, day] = React.useMemo((): [number, number, number] => {
    try {
      return splitDateString(props.dateString);
    } catch {
      return [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
    }
  }, [props.dateString]);

  const displayDate = React.useMemo(() => {
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleDateString("en-US", { month: "long" });
    const dayNumber = date.toLocaleDateString("en-US", {
      day: "numeric",
    });
    const yearNumber = date.toLocaleDateString("en-US", {
      year: "numeric",
    });
    return (
      <div>
        <Link href={`?p=month&t=${year}-${month.toString().padStart(2, "0")}`}>{monthName}</Link> {dayNumber},{" "}
        {yearNumber}
      </div>
    );
  }, [day, month, year]);

  const isCurrentDay = React.useMemo(() => {
    const date = new Date(year, month - 1, day);
    return date.toDateString() === new Date().toDateString();
  }, [day, month, year]);

  const displayDay = React.useMemo(() => {
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (date.toDateString() === new Date().toDateString()) {
      return `${dayName} (Today)`;
    } else {
      return dayName;
    }
  }, [day, month, year]);

  const surroundingDays = React.useMemo(() => {
    const date = new Date(year, month - 1, day);
    const days = [];
    for (let i = -3; i < 4; i++) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      days.push(newDate);
    }
    return days;
  }, [day, month, year]);

  const handleClickCalendar = React.useCallback(
    (i: number) => {
      setCreateModalPresetDate({
        date: new Date(year, month - 1, day),
        time: new Date(year, month - 1, day, 0, i * 60),
      });
      setCreateEventModalOpen(true);
    },
    [day, month, year],
  );

  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the container scroll position based on the current time or first event time
    if (container.current && containerNav.current && containerOffset.current) {
      const currentMinute = new Date().getHours() * 60;
      container.current.scrollTop =
        ((container.current.scrollHeight - containerNav.current.offsetHeight - containerOffset.current.offsetHeight) *
          currentMinute) /
        1440;
    }
  }, [props.events]);

  return (
    <div className="flex h-full flex-col">
      {!props.condensed && (
        <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              <time dateTime="2022-01-22" className="sm:hidden">
                {displayDate}
              </time>
              <time dateTime="2022-01-22" className="hidden sm:inline">
                {displayDate}
              </time>
            </h1>
            <p className="mt-1 text-sm text-gray-500">{displayDay}</p>
          </div>
          <div className="flex items-center">
            <div className="relative flex items-stretch rounded-md bg-white shadow-sm">
              <Link href={`?p=day&t=${getAdjacentDateString(props.dateString || "", -1)}`}>
                <button
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
                >
                  <span className="sr-only">Previous day</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </Link>
              <Link
                className="flex content-center items-center border border-y border-gray-300 pr-1"
                href={`?p=day&t=${createDateString(new Date())}`}
              >
                <button
                  type="button"
                  className="px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative"
                >
                  Today
                </button>
              </Link>
              <Link href={`?p=day&t=${getAdjacentDateString(props.dateString || "", 1)}`}>
                <button
                  type="button"
                  className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
                >
                  <span className="sr-only">Next day</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </Link>
            </div>
            <div className="hidden md:ml-4 md:flex md:items-center">
              <CalendarViewMenu timePeriod="day" />
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
      )}

      <div className="isolate flex flex-auto overflow-hidden bg-white">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <div
            ref={containerNav}
            className="sticky top-0 z-50 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
          >
            {surroundingDays.map((surroundingDay: Date) => (
              <button key={surroundingDay.getTime()} type="button" className="flex flex-col items-center pb-1.5 pt-3">
                <Link href={`?p=day&t=${createDateString(surroundingDay)}`}>
                  <span>{surroundingDay.toLocaleDateString("en-us", { weekday: "long" }).charAt(0)}</span>
                  <span
                    className={classNames(
                      "mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900",
                      {
                        "bg-gray-900 text-white":
                          new Date(year, month - 1, day).toDateString() === surroundingDay.toDateString(),
                      },
                    )}
                  >
                    {surroundingDay.getDate()}
                  </span>
                </Link>
              </button>
            ))}
          </div>
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                data-cy="calendar-row-grid"
                className="z-10 col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div key="container-offset" ref={containerOffset} className="row-end-1 h-7"></div>
                {Array.from({ length: 25 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div key={i} onClick={() => handleClickCalendar(i)} data-cy={`calendar-row-${i}`}>
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {i % 12 === 0 ? 12 : i % 12}
                        {i > 11 ? "PM" : "AM"}
                      </div>
                    </div>
                    <div
                      key={i + "half"}
                      onClick={() => handleClickCalendar(i + 0.5)}
                      data-cy={`calendar-row-${i + 0.5}`}
                    >
                      <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400" />
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                  gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                }}
              >
                {props.events.map((event) => {
                  const startMinute = event.scheduledFor.getHours() * 60 + event.scheduledFor.getMinutes();
                  const endMinute = startMinute + event.durationMinutes;
                  // TODO calculate this upfront for better performance
                  const concurrentEvents = props.events.filter((e) => {
                    const eStartMinute = e.scheduledFor.getHours() * 60 + e.scheduledFor.getMinutes();
                    const eEndMinute = eStartMinute + e.durationMinutes;
                    return eStartMinute < endMinute && eEndMinute > startMinute;
                  }).length;

                  return (
                    <li
                      key={event.id}
                      // TODO fix this margin top/bottom fudge factor
                      className="relative z-20 mb-[-12px] mt-[5px] flex"
                      style={{
                        gridRow: `${Math.round(startMinute / 5)} / span ${(endMinute - startMinute) / 5}`,
                        gridColumn: `auto / span ${Math.floor(12 / concurrentEvents)}`,
                      }}
                    >
                      <CalendarEvent event={event} />
                    </li>
                  );
                })}
                {isCurrentDay && (
                  <li
                    className="relative mt-px inline-flex h-1 bg-green-500"
                    key="current-time-line"
                    style={{
                      gridRow: ` ${Math.round((new Date().getHours() * 60 + new Date().getMinutes()) / 5)} / span 1`,
                      gridColumn: "auto / span 12",
                    }}
                  ></li>
                )}
              </ol>
            </div>
          </div>
        </div>
        {props.showMiniCalendar && (
          <div className="hidden w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10 md:block">
            <MiniMonthCalendar calendarDays={props.daysForMiniCalendar} />
          </div>
        )}
      </div>
      <EventCreateModal
        open={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        students={props.students}
        presetDate={createModalPresetDate}
        settings={props.settings}
      />
    </div>
  );
}
