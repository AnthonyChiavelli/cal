import MonthCalendar from "../../components/month_calendar";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import DayCalendar from "@/app/components/day_calendar";
import WeekCalendar from "@/app/components/week_calendar";
import prisma from "@/db";
import { CalendarDay } from "@/types";
import { IMonthNumber, getDaysForCalendarMonthGrid, parseDateString, parseMonthString } from "@/util/calendar";
import { getEventName } from "@/util/event";

async function calendarDaysForMonth(timeValue: string) {
  const [year, month] = parseMonthString(timeValue);

  const events = await prisma.event.findMany({
    orderBy: { scheduledFor: "asc" },
    where: { scheduledFor: { gte: new Date(year, month - 1, -7), lte: new Date(year, month, 7) } },
    include: { eventStudents: { include: { student: true } } },
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
        name: getEventName(e),
        time: e.scheduledFor.toLocaleTimeString("en-us", { hour: "numeric" }),
        datetime: e.scheduledFor.toString(),
        href: `/app/schedule/${e.id}`,
      })),
    };
  });
}

async function getEventsForDay(dateString: string) {
  let year: number, month: number, date: number;
  try {
    [year, month, date] = parseDateString(dateString);
  } catch {
    [year, month, date] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
  }
  const [dayStart, dayEnd] = [new Date(year, month - 1, date), new Date(year, month - 1, date + 1)];
  return await prisma.event.findMany({
    orderBy: { scheduledFor: "asc" },
    where: { scheduledFor: { gte: dayStart, lte: dayEnd } },
    include: { eventStudents: { include: { student: true } } },
  });
}

async function Schedule(params: { searchParams: { p?: string; t?: string } }) {
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
            daysForMiniCalendar={getDaysForCalendarMonthGrid(2, 2022)}
            showMiniCalendar={false}
          />
        );
      }
      case "week":
        return <WeekCalendar />;
      case "month": {
        const timeValue =
          params.searchParams.t || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        return <MonthCalendar monthString={timeValue} calendarDays={await calendarDaysForMonth(timeValue)} />;
      }
    }
  };
  return <>{renderTimePeriodComponent()}</>;
}

export default withPageAuthRequired(Schedule as any, { returnTo: "/app" });
