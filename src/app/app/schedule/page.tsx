import MonthCalendar from "../../components/month_calendar";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUserSettings } from "@/app/actions/user";
import DayCalendar from "@/app/components/day_calendar";
import WeekCalendar from "@/app/components/week_calendar";
import { getEvents } from "@/app/methods/event";
import { getAllStudents } from "@/app/methods/student";
import { CalendarDay } from "@/types";
import {
  IMonthNumber,
  getDaysForCalendarMonthGrid,
  splitDateString,
  parseMonthString,
  parseDateString,
  getPreviousMonday,
} from "@/util/calendar";
import { getEventName } from "@/util/event";

async function calendarDaysForMonth(timeValue: string) {
  const [year, month] = parseMonthString(timeValue);

  const events = await getEvents({
    scheduledFor: { gte: new Date(year, month - 1, -7), lte: new Date(year, month, 7) },
  });

  return getDaysForCalendarMonthGrid(month as IMonthNumber, year).map((calDay: CalendarDay) => {
    // TODO something more elegant than this
    const [year, month, date] = calDay.date.split("-").map(Number);
    const eventsForToday = events.filter(
      (e) =>
        e.scheduledFor.getFullYear() === year &&
        e.scheduledFor.getMonth() + 1 === month &&
        e.scheduledFor.getDate() === date,
    );
    return {
      ...calDay,
      events: eventsForToday.map((e) => ({
        id: e.id,
        event: e,
        name: getEventName(e),
        time: e.scheduledFor.toLocaleTimeString("en-us", { hour: "numeric" }),
        datetime: e.scheduledFor.toString(),
        href: `/app/schedule/${e.id}`,
      })),
    };
  });
}

// TODO extract into a method, guard by owner
async function getEventsForDay(dateString: string) {
  let year: number, month: number, date: number;
  try {
    [year, month, date] = splitDateString(dateString);
  } catch {
    [year, month, date] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
  }
  const [dayStart, dayEnd] = [new Date(year, month - 1, date), new Date(year, month - 1, date + 1)];

  return await getEvents({ scheduledFor: { gte: dayStart, lte: dayEnd } });
}

async function getEventsForWeek(dateString: string) {
  let date;
  try {
    date = parseDateString(dateString);
  } catch {
    date = new Date();
  }
  const weekStartDate = getPreviousMonday(date);
  const weekEndDate = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 7);
  return await getEvents({ scheduledFor: { gte: weekStartDate, lte: weekEndDate } });
}

async function Schedule(params: { searchParams: { p?: string; t?: string } }) {
  const settings = await getUserSettings();
  const timePeriod = params.searchParams.p || "month";
  const now = new Date();

  const renderTimePeriodComponent = async () => {
    switch (timePeriod) {
      case "day": {
        const timeValue =
          params.searchParams.t ||
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getDate()}`;
        return (
          <DayCalendar
            dateString={timeValue}
            events={await getEventsForDay(timeValue)}
            // TODO fix this hard-coded date
            daysForMiniCalendar={getDaysForCalendarMonthGrid(2, 2022)}
            showMiniCalendar={false}
            students={await getAllStudents()}
            settings={settings}
          />
        );
      }
      case "week":
        const timeValue =
          params.searchParams.t ||
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getDate()}`;
        return (
          <WeekCalendar
            weekString={timeValue}
            events={await getEventsForWeek(timeValue)}
            settings={settings}
            students={await getAllStudents()}
          />
        );
      case "month": {
        const timeValue =
          params.searchParams.t || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        return (
          <MonthCalendar
            monthString={timeValue}
            calendarDays={await calendarDaysForMonth(timeValue)}
            settings={settings}
            students={await getAllStudents()}
          />
        );
      }
    }
  };
  return <>{renderTimePeriodComponent()}</>;
}

export default withPageAuthRequired(Schedule as any, { returnTo: "/app" });
