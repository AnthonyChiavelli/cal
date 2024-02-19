import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import MonthCalendar from "../../components/month_calendar";
import { prisma } from "@/db";
import { CalendarDay } from "@/types";
import { IMonthNumber, getDaysForCalendarMonthGrid, parseMonthString } from "@/util/calendar";

async function calendarDays(timeValue: string) {
  const events = await prisma.class.findMany()

  const [year, month] = parseMonthString(timeValue) 

  return getDaysForCalendarMonthGrid(month as IMonthNumber, year).map((calDay: CalendarDay) => {
    const matchingEvents = events.filter((e) => e.scheduledFor.getFullYear() === year && e.scheduledFor.getMonth() + 1 === month && e.scheduledFor.getDate() === Number(calDay.date.split("-")[2]))
    return {
      ...calDay,
      events: matchingEvents.map(e => ({
        id: e.id,
        name: e.classType,
        time: e.scheduledFor.toLocaleTimeString('en-us', {'hour': 'numeric'}),
        datetime: e.scheduledFor.toString(),
        href: `/app/schedule/${e.id}`
      }))
    }
  })

}

function Schedule(params: {searchParams: { p?: string, t?: string }}) {
  const timePeriod = params.searchParams.p || 'month'
  const now = new Date();
  const timeValue = params.searchParams.t || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}`



  const renderTimePeriodComponent = async () => {
    switch (timePeriod) {
      case 'day':
        return <div>day</div>
      case 'week':
        return <div>day</div>
      case 'month':
        return <MonthCalendar monthString={timeValue} calendarDays={await calendarDays(timeValue)}/>
    }
  }
  return (
    <div>
      {renderTimePeriodComponent()}
    </div>
  );
}

export default withPageAuthRequired(Schedule as any, { returnTo: "/app" });
