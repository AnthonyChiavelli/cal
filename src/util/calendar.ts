import { RecurrencePattern } from "@/app/types";
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
 * Create a time string of the format "HH:MM" (24 hour format) from a date object, suitable for use in an input[type="time"]
 *
 * @param date the date
 * @returns a string in the format of HH:MM
 */
export function createTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
  const dateClone = new Date(date.getTime());
  const day = dateClone.getDay();
  const diff = dateClone.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(dateClone.setDate(diff));
}
/**
 * Returns a date that is the monday before the after date, or the provided date
 * if it is a monday.
 *
 * @param date the date
 * @returns the next (or current) monday
 */
export function getNextMonday(date: Date) {
  const dateClone = new Date(date.getTime());
  const day = dateClone.getDay();
  const mondayIndexedDay = day === 0 ? 7 : day;
  if (mondayIndexedDay === 0) {
    return dateClone;
  } else {
    const diff = dateClone.getDate() + (8 - mondayIndexedDay);
    return new Date(dateClone.setDate(diff));
  }
}

/**
 * Returns a date that is n minutes after the provided date
 *
 * @param date the date
 * @returns a new date n minutes after the provided date
 */
export function getDateNMinutesLater(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Parse a string in the format "HH:MM" and return the number of minutes it represents
 *
 * @param duration the duration in "HH:MM" format
 * @returns the number of minutes
 */
export function parseHourFormatDuration(duration: string): number {
  const [hours, minutes] = duration.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Parse a duration string in the format "HH:MM" or a number representing minutes, and return the number of minutes it represents
 *
 * @param duration the duration in "HH:MM" or "MM" format
 * @returns the number of minutes
 */
export function parseDuration(duration: string): number {
  if (/^[\d]+:[\d]{2}$/.test(duration)) {
    const [hours, minutes] = duration.split(":").map(Number);
    return hours * 60 + minutes;
  } else if (/^\d+$/.test(duration) && !isNaN(Number(duration))) {
    return Number(duration);
  }
  throw new Error("Invalid duration format");
}

/**
 * Compare 2 date objects, disregarding the time component. If the dates are equal, return 0.
 * If a is before b, return -1. If a is after b, return 1.
 *
 * @param a the first date
 * @param b the second date
 * @returns 0 if dates are equal, -1 if first date is before second, 1 if first date is after second
 */
export function compareDatesWithoutTime(a: Date, b: Date): -1 | 0 | 1 {
  if (a.getFullYear() !== b.getFullYear()) return a.getFullYear() < b.getFullYear() ? -1 : 1;
  if (a.getMonth() !== b.getMonth()) return a.getMonth() < b.getMonth() ? -1 : 1;
  if (a.getDate() !== b.getDate()) return a.getDate() < b.getDate() ? -1 : 1;
  return 0;
}

/**
 * Convert a sunday-index day number (0-6) to a monday-indexed day number (1-7)
 *
 * @param dayNumber A day number between 0-6, where 0 is sunday
 * @returns A day number between 1-7, where 1 is monday
 */
export function mondayIndexedDay(dayNumber: number): number {
  return dayNumber === 0 ? 7 : dayNumber;
}

const dayOfWeekToNumberMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

export function getDatesForRecurrencePattern(pattern: RecurrencePattern): Date[] {
  const dates: Date[] = [];
  const recurrenceType = pattern.recurrenceType || "weekly";

  // If the start date is later in the week than any days that would be included this week, begin on monday of next week
  // Otherwise, begin on monday of this week (days before start date will be shaved off later)
  const startDateAfterThisWeeksScheduledDays = pattern.weeklyDays?.every(
    (day) => dayOfWeekToNumberMap[day] < mondayIndexedDay(pattern.startDate.getDay()),
  );
  const startOfWeek = startDateAfterThisWeeksScheduledDays
    ? getNextMonday(pattern.startDate)
    : getPreviousMonday(pattern.startDate);
  let nextDate = startOfWeek;

  if (recurrenceType === "weekly") {
    // Keep making dates until we hit the end date
    while (compareDatesWithoutTime(nextDate, pattern.endDate) <= 0) {
      // Add the days for this week
      pattern.weeklyDays?.forEach((day) => {
        const dayNumber = dayOfWeekToNumberMap[day];
        const n = new Date(
          nextDate.getFullYear(),
          nextDate.getMonth(),
          nextDate.getDate() + (dayNumber - 1),
          pattern.startDate.getHours(),
          pattern.startDate.getMinutes(),
        );
        if (compareDatesWithoutTime(n, pattern.endDate) <= 0) {
          dates.push(n);
        }
      });
      // Advance to the next
      nextDate.setDate(nextDate.getDate() + (pattern.period || 1) * 7);
    }
  } else if (recurrenceType === "monthly") {
    // Keep making dates until we hit the end date
    while (compareDatesWithoutTime(nextDate, pattern.endDate) <= 0) {
      const n = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth(),
        nextDate.getDate(),
        pattern.startDate.getHours(),
        pattern.startDate.getMinutes(),
      );
      if (compareDatesWithoutTime(n, pattern.endDate) <= 0) {
        dates.push(n);
      }
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
  }

  // Cut out any dates before the start date or after the end date
  const filteredDates = dates.filter((date) => date >= pattern.startDate && date <= pattern.endDate);
  if (pattern.includeSelectedDate) {
    // Add the start date itself in if specified and if it's not already in the list
    const alreadyContainsStartDate = dates.some((date) => compareDatesWithoutTime(date, pattern.startDate) === 0);
    return alreadyContainsStartDate ? filteredDates : [pattern.startDate, ...filteredDates];
  }
  return filteredDates;
}

/**
 * A TS typeguard that ensures that a partial recurrence pattern is a complete recurrence pattern
 *
 * @param pattern A partial recurrence pattern
 * @returns true if the pattern is a complete recurrence pattern
 */
export function isCompleteRecurrencePattern(pattern: Partial<RecurrencePattern>): pattern is RecurrencePattern {
  return Boolean(
    pattern.endDate &&
      pattern.period &&
      pattern.recurrenceType &&
      pattern.startDate &&
      pattern.weeklyDays &&
      pattern.weeklyDays.length > 0,
  );
}
