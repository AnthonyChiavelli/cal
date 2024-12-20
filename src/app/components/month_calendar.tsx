"use client";

import { useTransition } from "react";
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "@nextui-org/react";
import { Student, UserSettings } from "@prisma/client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CalenderOverflowMenu from "@/app/components/calendar_overflow_menu";
import CalendarViewMenu from "@/app/components/calendar_view_menu";
import EventCreateModal from "@/app/components/event_create_modal";
import LoadingPane from "@/app/components/loading_pane";
import MonthCalendarMiniDay from "@/app/components/month_calendar_mini_day";
import MonthViewMiniCalendar from "@/app/components/month_view_mini_calendar";
import { CalendarDay } from "@/types";
import { createMonthString, getAdjacentMonthString, parseMonthString } from "@/util/calendar";

interface IMonthCalendar {
  monthString?: string;
  calendarDays: CalendarDay[];
  settings: UserSettings;
  students: Student[];
}

export default function MonthCalendar(props: IMonthCalendar) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDay, setSelectedDay] = React.useState<CalendarDay | null>(props.calendarDays[0] || null);
  const [showEventCreateModal, setShowEventCreateModal] = React.useState(false);
  const [createModalPresetDate, setCreateModalPresetDate] = React.useState<{ date?: Date; time?: Date } | undefined>(
    undefined,
  );

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
      if (props.settings?.showInlineDayCalendarInMobileView) {
        setSelectedDay(day);
      } else {
        router.push(`?p=day&t=${day.date}`);
      }
    },
    [props.settings?.showInlineDayCalendarInMobileView, router],
  );

  const handleLaunchCreateModal = React.useCallback((date?: Date, time?: Date) => {
    setCreateModalPresetDate({ date, time });
    setShowEventCreateModal(true);
  }, []);

  const [year, month] = React.useMemo((): [number, number] => {
    try {
      return parseMonthString(props.monthString);
    } catch {
      return [new Date().getFullYear(), new Date().getMonth() + 1];
    }
  }, [props.monthString]);

  const displayDate = React.useMemo((): string => {
    const monthName = new Date(year, month - 1).toLocaleString("en-us", { month: "long" });
    return `${monthName} ${year}`;
  }, [month, year]);

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex flex-col items-center justify-between border-b border-gray-200 px-2 py-4 xs:flex-row lg:flex-none lg:px-6">
        <h1 className="flex flex-row items-center justify-center text-base font-semibold leading-6 text-gray-900 xs:flex-col">
          <time dateTime={`${year}-${month}`}>{displayDate}</time>
          <div className={classNames("ml-3 text-xs font-normal xs:ml-0", { invisible: !isCurrentMonth })}>
            (Current month)
          </div>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-stretch rounded-md bg-white shadow-sm">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={() => goToPreviousMonth()}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex content-center items-center border border-y border-gray-300 pr-1">
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
                <span className="hidden lg:block">Add event</span>
                <span className="lg:hidden">+</span>
              </button>
            </Link>
          </div>
          <CalenderOverflowMenu />
        </div>
      </header>

      <div className="relative shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        {isPending && <LoadingPane />}
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="bg-white py-2">
              {day.charAt(0)}
              <span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
            </div>
          ))}
        </div>
        {/* Desktop calendar */}
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
            {/* Grid days */}
            {props.calendarDays.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "group relative px-3 py-2",
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
                <div className="absolute bottom-3 right-3 hidden group-hover:block">
                  <PlusCircleIcon
                    className="h-6 w-6 cursor-pointer text-blue-400"
                    onClick={() => {
                      handleLaunchCreateModal(new Date(day.date));
                    }}
                  />{" "}
                </div>
                {/* Day events */}
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((calendarEvent) => (
                      <li key={calendarEvent.id}>
                        <Tooltip
                          content={
                            <div className="p-3 text-gray-900">
                              <div className="text-md flex flex-row items-center font-bold">
                                {calendarEvent.name} {calendarEvent.event.cancelledAt && "(Cancelled)"}{" "}
                                {calendarEvent.event.completed && "(Completed)"}
                              </div>
                              <div className="text-sm">{calendarEvent.datetime}</div>
                            </div>
                          }
                          placement="top"
                        >
                          <Link href={calendarEvent.href} className="flex">
                            <p className="font-small flex-auto truncate text-gray-900 group-hover:text-indigo-600">
                              <span className="flex flex-row items-center">
                                <span className={classNames({ "line-through": calendarEvent.event.cancelledAt })}>
                                  {calendarEvent.name}
                                </span>
                                {calendarEvent.event.completed && <CheckIcon className="ml-1 h-4 w-4 text-green-500" />}
                              </span>
                            </p>
                            <time
                              dateTime={calendarEvent.datetime}
                              className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                            >
                              {calendarEvent.time}
                            </time>
                          </Link>
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
          <MonthViewMiniCalendar
            onSelectDay={handleClickMiniMonthDay}
            calendarDays={props.calendarDays}
            selectedDay={selectedDay}
          />
        </div>
      </div>
      {selectedDay && (
        <MonthCalendarMiniDay day={selectedDay} addEvent={() => handleLaunchCreateModal(new Date(selectedDay.date))} />
      )}
      <EventCreateModal
        open={showEventCreateModal}
        students={props.students}
        onClose={() => setShowEventCreateModal(false)}
        presetDate={createModalPresetDate}
        settings={props.settings}
      />
    </div>
  );
}
