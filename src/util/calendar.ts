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
  const today = new Date();
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
 * Create a date string of the format "YYYY-MM-DD"
 * @param Date the date from which to create the string
 * @returns A string in the format of YYYY-MM-DD
 */
export function createDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Parse a month string of the format "YYYY-MM"
 * @param monthString A string of the format 'YYYY-MM'
 * @returns A 2-tuple of the year number and 1-indexed month number
 */
export function parseMonthString(monthString?: string): [number, number] {
  if (!monthString || !monthString.match(/[\d]{4}-[\d]{1,2}/)) {
    throw new Error("Invalid month number provided");
  }
  const components = monthString.split("-");
  const year = Number(components[0]);
  const month = Number(components[1]);
  if (month < 1 || month > 12) {
    throw new Error("Invalid month number provided");
  }
  return [year, month];
}

/**
 * Parse a month string of the format "YYYY-MM-DD" and return the components as strings
 * @param monthString A string of the format 'YYYY-MM-DD'
 * @returns A 3-tuple of: the year number, 1-indexed month number, and the date
 */
export function splitDateString(dateString?: string): [number, number, number] {
  if (!dateString || !dateString.match(/[\d]{4}-[\d]{1,2}-[\d]{1,2}/)) {
    throw new Error("Invalid date string provided");
  }
  const components = dateString.split("-");
  const year = Number(components[0]);
  const month = Number(components[1]);
  const date = Number(components[2]);
  if (month < 1 || month > 12) {
    throw new Error("Invalid month number provided");
  }
  return [year, month, date];
}

/**
 * Parse a month string of the format "YYYY-MM-DD" and return a date
 * @param monthString A string of the format 'YYYY-MM-DD'
 * @returns a date
 */
export function parseDateString(dateString?: string): Date {
  const components = splitDateString(dateString);
  return new Date(components[0], components[1] - 1, components[2]);
}

/**
 * Returns a month string (YYYY-MM) representing the month before or after the provided one
 *
 * @param monthString A string in the format of YYY-MM
 * @param direction 1 to retrieve the string for the next month, -1 for the previous
 * @returns A new month string representing the month adjacent to the provided month, in the direction provided
 */
export function getAdjacentMonthString(monthString: string, direction: 1 | -1): string {
  const [year, month] = parseMonthString(monthString);
  const newMonth = month + direction;
  if (newMonth < 1) {
    return createMonthString(year - 1, 12);
  } else if (newMonth > 12) {
    return createMonthString(year + 1, 1);
  } else {
    return createMonthString(year, newMonth);
  }
}

/**
 * Returns a date string (YYYY-MM-DD) representing the date before or after the provided one
 *
 * @param monthString A string in the format of YYY-MM-DD
 * @param direction 1 to retrieve the string for the next day, -1 for the previous
 * @returns A new date string representing the day adjacent to the provided month, in the direction provided
 */
export function getAdjacentDateString(dateString: string, direction: 1 | -1): string {
  let year: number, month: number, date: number;
  try {
    [year, month, date] = splitDateString(dateString);
  } catch {
    [year, month, date] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
  }
  const newDate = new Date(year, month - 1, date + direction);
  return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(newDate.getDate()).padStart(2, "0")}`;
}

/**
 * Returns a date string (YYYY-MM) representing the week before or after the provided one
 *
 * @param dateString A string in the format of YYY-MM-DD
 * @param direction 1 to retrieve the string for the next week, -1 for the previous
 * @returns A new date string representing the week adjacent to the provided week, in the direction provided
 */
export function getAdjacentWeekString(dateString: string, direction: 1 | -1): string {
  const [year, month, date] = splitDateString(dateString);
  const deltaDay = direction * 7;
  const newDate = new Date(year, month - 1, date + deltaDay);
  return createDateString(newDate);
}
/**
 * Returns a date that is the monday before the provided date, or the provided date
 * if it is a monday.
 *
 * @param date the date
 * @returns the previous (or current) monday
 */
export function getPreviousMonday(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}
