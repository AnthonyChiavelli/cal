import { CalendarDay } from "@/types";

export type IMonthNumber = 1 | 2 | 3 | 6 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Returns an array of CalendarDays representing the squares in a calendar grid, for the given month. If the month
 * does not start on a monday, previous dates will be added to pad the calendar. Likewise, if the month does not end on sunday,
 * dates will be added after to pad the month
 *
 * @param month the month to display (1 = January)
 * @param year the year to display
 * @returns CalendarDay[]
 */
export function getDaysForCalendarMonthGrid(
  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  year: number,
): CalendarDay[] {
  const today = new Date()
  // Fill 42 (7 rows) of grid dates starting at monday before or at start of month
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  let gridDates = Array(42)
    .fill(null)
    .map((_, i) => new Date(year, month - 1, i - (firstDayOfMonth - 2)));
  // Shave off extra rows if they're all dates in the next month
  while (gridDates.slice(-7).every((d: Date) => d.getMonth() > month - 1 || d.getFullYear() > year))
    gridDates = gridDates.slice(0, -7);
  return gridDates.map((d: Date) => ({
    date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getDate()}`,
    isCurrentMonth: d.getMonth() + 1 === month,
    isToday: d.toDateString() === today.toDateString(),
    events: [],
  }));
}

/**
 * Create a month string of the format "YYYY-MM"
 * @param year the number of the year
 * @param month the number of the month (1 indexed)
 * @returns A string in the format of YYYY-MM
 */
export function createMonthString(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * Parse a month string of the format "YYYY-MM"
 * @param monthString A string of the format 'YYYY-MM'
 * @returns A 2-tuple of the year number and 0-indexed month number
 */
export function parseMonthString(monthString: string) {
  if (!monthString.match(/[\d]{4}-[\d]{2}/)) {
    throw new Error("Invalid month string provided");
  }
  const components = monthString.split("-");
  const year = Number(components[0]);
  const month = Number(components[1]);
  return [year, month]
}

/**
 * Returns a month string (YYYY-MM) representing the month before or after the provided one
 *
 * @param monthString A string in the format of YYY-MM
 * @param direction 1 to retrieve the string for the next month, -1 for the previous
 * @returns A new month string representing the month adjacent to the provided month, in the direction provided
 */
export function getAdjacentMonthString(monthString: string, direction: 1 | -1): String {
  const [year, month] = parseMonthString(monthString)
  const newMonth = month + direction;
  if (newMonth < 1) {
    return createMonthString(year - 1, 12);
  } else if (newMonth > 12) {
    return createMonthString(year + 1, 1);
  } else {
    return createMonthString(year, newMonth);
  }
}
