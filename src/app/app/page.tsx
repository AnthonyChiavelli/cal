import { prisma } from "@/db";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import Button from "../components/button";
import { createMockEvent } from "../actions/students";
import UpcomingEvent from "../components/upcoming_event";
import DailyFinances from "../components/daily_finances";

async function getUpcomingEvents() {
  return prisma.class.findMany({
    orderBy: { scheduledFor: "desc" },
    include: {
      students: true,
    },
  });
}

async function App() {
  const session = await getSession();
  const upcomingEvents = await getUpcomingEvents();

  return (
    <div>
      <header className="mb-5">
        <h1>{session?.user.given_name ? `Welcome, ${session.user.given_name}` : "Welcome"}</h1>
      </header>
      <section>
        <div className="lg:grid lg:grid-cols-10 lg:gap-10 lg:px-0">
          <div className="bg-white p-4 mb-7 lg:col-span-6 rounded-sm shadow-md">
            <h4>On deck for today</h4>
            <div className="mt-5 flex flex-col gap-1">
              {upcomingEvents.map((event) => (
                <UpcomingEvent key={event.id} event={event} />
              ))}
            </div>
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
        {/* <Button flavor="primary" onClick={createMockStudents} text="Generate"/> */}
        <Button onClick={createMockEvent} text="Create mock event" flavor="primary" />
      </section>
    </div>
  );
}

export default withPageAuthRequired(App as any, { returnTo: "/app" });
