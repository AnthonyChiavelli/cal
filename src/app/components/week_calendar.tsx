"use client";

import { Fragment, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useOnMediaQueryState } from "../../util/hooks";
import { Event, EventStudent, Student, UserSettings } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createDateString, getAdjacentWeekString, getPreviousMonday, parseDateString } from "@/util/calendar";
import Button from "./button";
import CalendarEvent from "./calendar_event";
import CalenderOverflowMenu from "./calendar_overflow_menu";
import CalendarViewMenu from "./calendar_view_menu";
import EventCreateModal from "./event_create_modal";

interface IWeekCalendarProps {
  weekString: string;
  settings: UserSettings;
  students: Student[];
  events: Array<
    Event & {
      eventStudents: Array<EventStudent & { student: Student }>;
    }
  >;
}

export default function WeekCalendar(props: IWeekCalendarProps) {
  const router = useRouter();

  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [createModalPresetDate, setCreateModalPresetDate] = useState<{ date?: Date; time?: Date } | undefined>(
    undefined,
  );

  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  const isMobileSize = useOnMediaQueryState("640px");

  const goToPreviousWeek = () => {
    startTransition(() => {
      router.push(`?p=week&t=${getAdjacentWeekString(props.weekString || "", -1)}`);
    });
  };

  const goToCurrentWeek = () => {
    startTransition(() => {
      router.push(`?p=week&t=${createDateString(getPreviousMonday(new Date()))}`);
    });
  };

  const goToNextWeek = () => {
    startTransition(() => {
      router.push(`?p=week&t=${getAdjacentWeekString(props.weekString || "", 1)}`);
    });
  };

  const [year, month, day] = useMemo((): [number, number, number] => {
    let date;
    try {
      date = parseDateString(props.weekString);
    } catch {
      date = new Date();
    }
    const previousMonday = getPreviousMonday(date);
    return [previousMonday.getFullYear(), previousMonday.getMonth() + 1, previousMonday.getDate()];
  }, [props.weekString]);

  const startDate = useMemo(() => new Date(year, month - 1, day), [day, month, year]);

  const displayDate = useMemo((): string => {
    return startDate.toLocaleDateString("en-us", { month: "long", day: "numeric", year: "numeric" });
  }, [startDate]);

  const isCurrentWeek = useMemo(() => {
    const currentMonday = getPreviousMonday(new Date());
    return startDate.toDateString() === currentMonday.toDateString();
  }, [startDate]);

  const daysOfWeek = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
        return {
          href: `/app/schedule?p=day&t=${createDateString(date)}`,
          date: date.getDate(),
          day: date.toLocaleString("en-us", { weekday: "short" }),
          isToday: date.toDateString() === new Date().toDateString(),
        };
      }),
    [startDate],
  );

  const handleClickCalendar = useCallback(
    (hour: number, date: Date) => {
      setCreateModalPresetDate({
        date,
        time: new Date(year, month - 1, day, 0, hour * 60),
      });
      setCreateEventModalOpen(true);
    },
    [day, month, year],
  );

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
    if (container.current && containerNav.current && containerOffset.current) {
      if (container.current.scrollHeight && container.current.offsetHeight) {
        container.current.scrollTop =
          ((container.current.scrollHeight - containerNav.current.offsetHeight - containerOffset.current.offsetHeight) *
            currentMinute) /
          1440;
      }
    }
  }, []);

  return (
    <div className="relative flex h-full flex-col">
      {isMobileSize && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black p-5 text-white opacity-70">
          Week view calendar not yet supported on small screen sizes. Stay tuned!
        </div>
      )}
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime={`${year}-${month}-${day}`}>{displayDate}</time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-stretch rounded-md bg-white shadow-sm">
            <button
              onClick={goToPreviousWeek}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Previous week</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex content-center items-center border border-y border-gray-300 pr-1">
              <button
                onClick={goToCurrentWeek}
                type="button"
                className="px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative"
              >
                Today
              </button>
            </div>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              onClick={goToNextWeek}
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            >
              <span className="sr-only">Next week</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <CalendarViewMenu timePeriod="week" />
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <Link href="/app/schedule/add">
              <Button flavor="primary" text="Add event" />
            </Link>
          </div>
          <CalenderOverflowMenu />
        </div>
      </header>
      <div ref={container} className="isolate flex flex-auto flex-col overflow-y-auto overflow-x-hidden bg-white">
        <div style={{ width: "165%" }} className="flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
          <div
            ref={containerNav}
            className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5"
          >
            <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
              {daysOfWeek.map((day) => (
                <button key={day.date} type="button" className="flex flex-col items-center pb-3 pt-2">
                  {day.day.charAt(0)}{" "}
                  <span className="mt-1 flex h-8 w-8 items-center justify-center font-semibold text-gray-900">
                    {day.isToday ? (
                      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                        {day.date}
                      </span>
                    ) : (
                      <>{day.date}</>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="-mr-px hidden grid-cols-14 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
              <div className="col-end-1 w-14" />
              {daysOfWeek.map((day) => (
                <Link href={day.href} key={day.date} className="sm:col-span-2 sm:col-start-auto">
                  <div key={day.date} className="flex items-center justify-center py-3">
                    <span className={classNames({ "flex items-baseline": day.isToday })}>
                      {day.day}{" "}
                      <span className="items-center justify-center font-semibold text-gray-900">
                        {day.isToday ? (
                          <span className="ml-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                            {day.date}
                          </span>
                        ) : (
                          <span className="items-center justify-center font-semibold text-gray-900">{day.date}</span>
                        )}
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-auto">
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                key="horizontal-line"
                className="z-10 col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>

                {Array.from({ length: 25 }).map((_, i) => (
                  //  Calendar row pair
                  <Fragment key={i}>
                    {/* Hour row */}
                    <div className="relative grid grid-cols-7" key={i}>
                      {/* Hour display */}
                      <div className="absolute left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                        {i % 12 === 0 ? 12 : i % 12}
                        {i > 11 ? "PM" : "AM"}
                      </div>
                      {/* Hour cells */}
                      {Array.from({ length: 7 }).map((_, j) => (
                        <div
                          className="z-20 col-span-1"
                          onClick={() => handleClickCalendar(i, new Date(year, month - 1, day + j))}
                          key={`${i}-${j}`}
                        ></div>
                      ))}
                    </div>

                    {/* Half-hour row */}
                    <div className="grid grid-cols-7">
                      {/* Half-hour cells */}
                      {Array.from({ length: 7 }).map((_, j) => (
                        <div
                          className="z-20 col-span-1"
                          onClick={() => handleClickCalendar(i + 0.5, new Date(year, month - 1, day + j))}
                          key={`${i}-${j}`}
                        ></div>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>

              {/* Vertical lines */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-14 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-14">
                <div className="col-start-1 row-span-full" />
                <div className="col-start-3 row-span-full" />
                <div className="col-start-5 row-span-full" />
                <div className="col-start-7 row-span-full" />
                <div className="col-start-9 row-span-full" />
                <div className="col-start-11 row-span-full" />
                <div className="col-start-13 row-span-full" />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-14"
                style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
              >
                {props.events.map((event) => {
                  // TODO handle concurrent events
                  const column = event.scheduledFor.getDate() - startDate.getDate() + 1;

                  const startMinute = event.scheduledFor.getHours() * 60 + event.scheduledFor.getMinutes();
                  const endMinute = startMinute + event.durationMinutes;

                  const dayToCSSColumnClassMap: { [k: number]: string } = {
                    1: "sm:col-start-1",
                    2: "sm:col-start-3",
                    3: "sm:col-start-5",
                    4: "sm:col-start-7",
                    5: "sm:col-start-9",
                    6: "sm:col-start-11",
                    7: "sm:col-start-13",
                  };

                  return (
                    <li
                      key={event.id}
                      // TODO fix this margin top/bottom fudge factor
                      className={`relative mt-px flex ${dayToCSSColumnClassMap[column]} z-20 col-span-2 mb-[-12px] mt-[5px]`}
                      style={{
                        gridRow: `${Math.round(startMinute / 5)} / span ${(endMinute - startMinute) / 5}`,
                      }}
                    >
                      <CalendarEvent event={event} />
                    </li>
                  );
                })}
                {/* Time line */}
                {isCurrentWeek && (
                  <li
                    className="relative mt-px inline-flex h-1 bg-green-500"
                    key="current-time-line"
                    style={{
                      gridRow: `${Math.round((new Date().getHours() * 60 + new Date().getMinutes()) / 5)} / span 1`,
                      gridColumn: `${new Date().getDay() * 2 - 1} / span 2`,
                    }}
                  ></li>
                )}
              </ol>
            </div>
          </div>
        </div>
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
