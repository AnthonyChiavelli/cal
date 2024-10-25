import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { RecurrencePattern } from "../types";
import classNames from "classnames";
import { getDatesForRecurrencePattern } from "@/util/calendar";

interface IRecurrenecePreviewProps {
  recurrentPattern: RecurrencePattern;
}

export default function RecurrencePreview(props: IRecurrenecePreviewProps) {
  const [page, setPage] = useState(0);
  const dates = useMemo(
    () => getDatesForRecurrencePattern(props.recurrentPattern).slice(page * 10, (page + 1) * 10),
    [page, props.recurrentPattern],
  );

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="text-lg font-semibold">Recurrence Preview</div>
      <div className="flex flex-col">
        <div>
          {dates.map((date) => (
            <div key={date.toISOString()}>
              {date.toLocaleDateString("en-us", { year: "numeric", month: "short", day: "numeric", weekday: "long" })}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-row justify-around space-x-2">
          <button onClick={() => setPage(page - 1)} disabled={page === 0}>
            <ChevronLeftIcon className={classNames("h-5 w-5", { "text-slate-300": page === 0 })} />
          </button>
          <button onClick={() => setPage(page + 1)} disabled={dates.length < 10}>
            <ChevronRightIcon className={classNames("h-5 w-5", { "text-slate-300": dates.length < 10 })} />
          </button>
        </div>
        {dates.length === 0 && <div>No dates</div>}
      </div>
    </div>
  );
}
