import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import MonthCalendar from "../../components/month_calendar";

function Schedule() {
  return (
    <div>
      <MonthCalendar />
    </div>
  );
}

export default withPageAuthRequired(Schedule as any, { returnTo: "/app" });
