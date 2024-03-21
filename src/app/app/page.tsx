import { getUserSettings } from "../actions";
import DayCalendar from "../components/day_calendar";
import { getAllStudents } from "../methods/student";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import DailyFinances from "@/app/components/daily_finances";
import { getEvents } from "@/app/methods/event";
import { createDateString, getDaysForCalendarMonthGrid, splitDateString } from "@/util/calendar";

async function getEventsForDay(dateString: string) {
  // TODO move this to methods
  let year: number, month: number, date: number;
  try {
    [year, month, date] = splitDateString(dateString);
  } catch {
    [year, month, date] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
  }
  const [dayStart, dayEnd] = [new Date(year, month - 1, date), new Date(year, month - 1, date + 1)];

  return await getEvents({ scheduledFor: { gte: dayStart, lte: dayEnd } });
}

async function App() {
  const session = await getSession();

  return (
    <div>
      <header className="mb-5">
        <h1>{session?.user.given_name ? `Welcome, ${session.user.given_name}` : "Welcome"}</h1>
      </header>
      <section>
        <div className="lg:grid lg:grid-cols-10 lg:gap-10 lg:px-0">
          <div className="bg-white p-4 mb-7 lg:col-span-6 rounded-sm shadow-md">
            <DayCalendar
              dateString={createDateString(new Date())}
              events={await getEventsForDay(createDateString(new Date()))}
              // TODO fix this hard-coded date
              daysForMiniCalendar={getDaysForCalendarMonthGrid(2, 2022)}
              showMiniCalendar={false}
              students={await getAllStudents()}
              settings={await getUserSettings()}
              condensed
            />
          </div>
          <div className="bg-white p-4 mb-7 lg:col-span-4 rounded-sm shadow-md">
            <h4>Finances</h4>
            <div className="mt-5 p-3">
              <div className="mb-5">
                <div>Unpaid Invoices</div>
                <h2>$ 120.45</h2>
              </div>
              <div className="mb-5">
                <div>Weekly Earnings</div>
                <h2>$ 650.34</h2>
              </div>
              <div className="mb-5">
                <div>Weekly Earnings</div>
                <h2>$ 650.34</h2>
              </div>
              <DailyFinances />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withPageAuthRequired(App as any, { returnTo: "/app" });
