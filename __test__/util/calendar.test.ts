import {
  getAdjacentMonthString,
  getDaysForCalendarMonthGrid,
  splitDateString,
  parseMonthString,
  createDateString,
  getAdjacentWeekString,
  getPreviousMonday,
  parseDateString,
  getDateNMinutesLater,
  parseHourFormatDuration,
  parseDuration,
  createTimeString,
  getDatesForRecurrencePattern,
  getNextMonday,
} from "../../src/util/calendar";
import { getAdjacentDateString } from "../../src/util/calendar";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom";
import { RecurrencePattern } from "@/app/types";

describe("getDaysForCalendarMonthGrid", () => {
  it("returns the correct days for Jan 2022 (first month of year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(1, 2022);
    const expected = [
      { date: "2021-12-27", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-12-28", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-12-29", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-12-30", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-12-31", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-01-1", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-2", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-3", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-4", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-5", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-6", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-7", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-8", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-9", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-10", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-11", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-12", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-13", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-14", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-15", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-16", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-17", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-18", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-19", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-20", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-21", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-22", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-23", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-24", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-25", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-26", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-27", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-28", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-29", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-30", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-01-31", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-1", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-2", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-3", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-4", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-5", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-6", isCurrentMonth: false, events: [], isToday: false },
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Feb 2020 (a month in the middle of a year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(2, 2022);
    const expected = [
      { date: "2022-01-31", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-02-1", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-2", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-3", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-4", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-5", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-6", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-7", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-8", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-9", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-10", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-11", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-12", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-13", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-14", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-15", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-16", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-17", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-18", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-19", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-20", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-21", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-22", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-23", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-24", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-25", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-26", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-27", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-02-28", isCurrentMonth: true, events: [], isToday: false },
      { date: "2022-03-1", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-03-2", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-03-3", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-03-4", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-03-5", isCurrentMonth: false, events: [], isToday: false },
      { date: "2022-03-6", isCurrentMonth: false, events: [], isToday: false },
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Dec 2020 (a month at the end of a year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(12, 2020);
    const expected = [
      { date: "2020-11-30", isCurrentMonth: false, events: [], isToday: false },
      { date: "2020-12-1", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-2", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-3", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-4", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-5", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-6", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-7", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-8", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-9", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-10", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-11", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-12", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-13", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-14", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-15", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-16", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-17", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-18", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-19", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-20", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-21", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-22", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-23", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-24", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-25", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-26", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-27", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-28", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-29", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-30", isCurrentMonth: true, events: [], isToday: false },
      { date: "2020-12-31", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-01-1", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-01-2", isCurrentMonth: false, events: [], isToday: false },
      { date: "2021-01-3", isCurrentMonth: false, events: [], isToday: false },
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Feb 2021 (a short month, with no filler)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(2, 2021);
    const expected = [
      { date: "2021-02-1", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-2", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-3", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-4", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-5", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-6", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-7", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-8", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-9", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-10", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-11", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-12", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-13", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-14", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-15", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-16", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-17", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-18", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-19", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-20", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-21", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-22", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-23", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-24", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-25", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-26", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-27", isCurrentMonth: true, events: [], isToday: false },
      { date: "2021-02-28", isCurrentMonth: true, events: [], isToday: false },
    ];
    expect(calendarDays).toEqual(expected);
  });
});

describe("getAdjacentMonthString", () => {
  it("correctly handles adjacent months within the same year", () => {
    expect(getAdjacentMonthString("2024-06", 1)).toEqual("2024-07");
    expect(getAdjacentMonthString("2024-06", -1)).toEqual("2024-05");
  });

  it("correctly handles adjacent months spanning years", () => {
    expect(getAdjacentMonthString("2024-12", 1)).toEqual("2025-01");
    expect(getAdjacentMonthString("2024-01", -1)).toEqual("2023-12");
  });
});

describe("parseMonthString", () => {
  it("should parse valid month string correctly", () => {
    expect(parseMonthString("2022-01")).toEqual([2022, 1]);
    expect(parseMonthString("2023-12")).toEqual([2023, 12]);
    expect(parseMonthString("2021-09")).toEqual([2021, 9]);
  });

  it("should throw an error for invalid month string", () => {
    expect(() => parseMonthString("2022-13")).toThrow("Invalid month number provided");
    expect(() => parseMonthString("2023-00")).toThrow("Invalid month number provided");
    expect(() => parseMonthString("2021-13")).toThrow("Invalid month number provided");
    expect(() => parseMonthString("2021-")).toThrow("Invalid month number provided");
    expect(() => parseMonthString("2021")).toThrow("Invalid month number provided");
    expect(() => parseMonthString("abc")).toThrow("Invalid month number provided");
  });
});

describe("splitDateString", () => {
  it.each([
    ["2022-01-15", [2022, 1, 15]],
    ["2023-12-25", [2023, 12, 25]],
    ["2021-09-01", [2021, 9, 1]],
    ["2021-09-1", [2021, 9, 1]],
    ["2021-9-1", [2021, 9, 1]],
  ])("returns the correct date components for a valid date string", (dateString, expected) => {
    expect(splitDateString(dateString)).toEqual(expected);
  });

  it("throws an error for an invalid date string", () => {
    const dateString = "2022-01-";
    expect(() => splitDateString(dateString)).toThrow("Invalid date string provided");
  });

  it("throws an error for an invalid month number", () => {
    const dateString = "2022-13-15";
    expect(() => splitDateString(dateString)).toThrow("Invalid month number provided");
  });
});

describe("parseDateString", () => {
  it.each([
    ["2022-01-15", new Date(2022, 0, 15)],
    ["2023-12-25", new Date(2023, 11, 25)],
    ["2021-09-01", new Date(2021, 8, 1)],
    ["2021-09-1", new Date(2021, 8, 1)],
    ["2021-9-1", new Date(2021, 8, 1)],
  ])("returns the correct date components for a valid date string", (dateString, expected) => {
    expect(parseDateString(dateString)).toEqual(expected);
  });

  it("throws an error for an invalid date string", () => {
    const dateString = "2022-01-";
    expect(() => parseDateString(dateString)).toThrow("Invalid date string provided");
  });

  it("throws an error for an invalid month number", () => {
    const dateString = "2022-13-15";
    expect(() => parseDateString(dateString)).toThrow("Invalid month number provided");
  });
});

describe("getAdjacentDateString", () => {
  it("returns the correct adjacent date when direction is 1", () => {
    let currentDateString = "2022-01-15";
    for (let i = 1; i < 50; i++) {
      const adjacentDateString = getAdjacentDateString(currentDateString, 1);
      expect(() => splitDateString(adjacentDateString)).not.toThrow();
      const currentDate = new Date(currentDateString);
      const nextDate = new Date(adjacentDateString);
      expect(nextDate.getTime() - currentDate.getTime()).toEqual(24 * 60 * 60 * 1000);
      currentDateString = adjacentDateString;
    }
  });

  it("returns the correct adjacent date when direction is -1", () => {
    let currentDateString = "2022-01-15";
    for (let i = 1; i < 50; i++) {
      const adjacentDateString = getAdjacentDateString(currentDateString, -1);
      expect(() => splitDateString(adjacentDateString)).not.toThrow();
      const currentDate = new Date(currentDateString);
      const nextDate = new Date(adjacentDateString);
      expect(currentDate.getTime() - nextDate.getTime()).toEqual(24 * 60 * 60 * 1000);
      currentDateString = adjacentDateString;
    }
  });
});

describe("getAdjacentWeekString", () => {
  it("returns the correct week string when the direction is 1 (including across month boundaries)", () => {
    let currentWeekString = "2022-01-01";
    for (let i = 1; i < 50; i++) {
      const nextWeekString = getAdjacentWeekString(currentWeekString, 1);
      expect(() => splitDateString(nextWeekString)).not.toThrow();
      const currentDate = new Date(currentWeekString);
      const nextDate = new Date(nextWeekString);
      expect(nextDate.getTime() - currentDate.getTime()).toEqual(7 * 24 * 60 * 60 * 1000);
    }
  });
  it("returns the correct week string when the direction is -1 (including across month boundaries)", () => {
    let currentWeekString = "2022-01-01";
    for (let i = 1; i < 50; i++) {
      const nextWeekString = getAdjacentWeekString(currentWeekString, -1);
      expect(() => splitDateString(nextWeekString)).not.toThrow();
      const currentDate = new Date(currentWeekString);
      const nextDate = new Date(nextWeekString);
      expect(nextDate.getTime() - currentDate.getTime()).toEqual(-1 * 7 * 24 * 60 * 60 * 1000);
    }
  });
});

describe("createDateString", () => {
  it.each([
    [new Date(2022, 0, 1), "2022-01-01"],
    [new Date(2023, 11, 31), "2023-12-31"],
    [new Date(2021, 8, 15), "2021-09-15"],
  ])("returns the correct date string for a given date", (date: Date, expectedDateString: string) => {
    const dateString = createDateString(date);
    expect(dateString).toBe(expectedDateString);
  });
});

describe("getPreviousMonday", () => {
  it.each([
    [new Date(2022, 4, 1)],
    [new Date(2023, 11, 31)],
    [new Date(2021, 8, 15)],
    [new Date(2020, 6, 15)],
    [new Date(2020, 6, 16)],
    [new Date(2020, 6, 17)],
    [new Date(2020, 6, 18)],
    [new Date(2020, 6, 19)],
  ])("returns the previous Monday when the provided date is not a Monday", (date: Date) => {
    const prevMonday = getPreviousMonday(date);
    expect(prevMonday.getDay()).toBe(1);
    expect(prevMonday < date).toBe(true);

    const diff = date.getTime() - prevMonday.getTime();
    expect(diff).toBeLessThan(7 * 24 * 60 * 60 * 1000);
    expect(diff).toBeGreaterThan(0);
  });

  it("returns the provided date when it is a Monday", () => {
    const date = new Date(2022, 0, 10); // a Monday
    const previousMonday = getPreviousMonday(date);
    expect(previousMonday).toEqual(date);
  });

  it("does not mutate the provided date", () => {
    const date = new Date(2022, 0, 11); // a Monday
    const originalDate = new Date(date.getTime());
    getPreviousMonday(date);
    expect(originalDate).toEqual(date);
  });
});

describe("getNextMonday", () => {
  it.each([
    [new Date(2022, 4, 1, 0, 0, 0)],
    [new Date(2023, 11, 31, 0, 0, 0)],
    [new Date(2021, 8, 15, 0, 0, 0)],
    [new Date(2020, 6, 15, 0, 0, 0)],
    [new Date(2020, 6, 16, 0, 0, 0)],
    [new Date(2020, 6, 17, 0, 0, 0)],
    [new Date(2020, 6, 18, 0, 0, 0)],
    [new Date(2020, 6, 19, 0, 0, 0)],
  ])("returns the previous Monday when the provided date is not a Monday", (date: Date) => {
    const nextMonday = getNextMonday(date);
    expect(nextMonday.getDay()).toBe(1);
    expect(nextMonday > date).toBe(true);
    const diff = nextMonday.getTime() - date.getTime();
    expect(diff).toBeLessThan(7 * 24 * 60 * 60 * 1000);
    expect(diff).toBeGreaterThan(0);
  });

  it("returns the provided date when it is a Monday", () => {
    const date = new Date(2022, 0, 10); // a Monday
    const previousMonday = getPreviousMonday(date);
    expect(previousMonday).toEqual(date);
  });

  it("does not mutate the provided date", () => {
    const date = new Date(2022, 0, 11); // a Monday
    const originalDate = new Date(date.getTime());
    getPreviousMonday(date);
    expect(originalDate).toEqual(date);
  });
});

describe("getDateNMinutesLater", () => {
  it.each([
    [new Date(2022, 0, 1, 0, 0, 0), 60, new Date(2022, 0, 1, 1, 0, 0)],
    [new Date(2022, 11, 31, 23, 59, 0), 1, new Date(2023, 0, 1, 0, 0, 0)],
    [new Date(2021, 8, 15, 12, 0, 0), 60, new Date(2021, 8, 15, 13, 0, 0)],
    [new Date(2020, 6, 15, 0, 0, 0), 1440, new Date(2020, 6, 16, 0, 0, 0)],
  ])(
    "returns the correct date for a given date and number of minutes",
    (date: Date, minutes: number, expectedDate: Date) => {
      const newDate = getDateNMinutesLater(date, minutes);
      expect(newDate).toEqual(expectedDate);
    },
  );
});

describe("parseHourFormatDuration", () => {
  it.each([
    ["00:00", 0],
    ["00:01", 1],
    ["01:00", 60],
    ["01:01", 61],
    ["01:30", 90],
    ["02:30", 150],
    ["10:02", 602],
  ])("returns the correct number of minutes for a given duration string", (durationString, expectedMinutes) => {
    expect(parseHourFormatDuration(durationString)).toBe(expectedMinutes);
  });
});

describe("parseDuration", () => {
  it.each([
    ["00:00", 0, false],
    ["00:01", 1, false],
    ["01:00", 60, false],
    ["01:01", 61, false],
    ["01:30", 90, false],
    ["02:30", 150, false],
    ["10:02", 602, false],
    ["5", 5, false],
    ["10", 10, false],
    ["105", 105, false],
    ["abc", undefined, true],
    ["10.0", undefined, true],
    ["$100", undefined, true],
    ["10 ", undefined, true],
    ["10 50", undefined, true],
    ["100,00", undefined, true],
    [":30", undefined, true],
    ["1:2", undefined, true],
    ["1:234", undefined, true],
    ["1:2a", undefined, true],
    ["1::20", undefined, true],
  ])(
    "returns the correct number of minutes for a given duration string",
    (durationString, expectedMinutes, shouldThrow) => {
      if (shouldThrow) {
        expect(() => parseDuration(durationString)).toThrow("Invalid duration format");
      } else {
        expect(parseDuration(durationString)).toBe(expectedMinutes);
      }
    },
  );
});

describe("createTimeString", () => {
  it.each([
    [new Date(2000, 10, 9, 9, 11), "09:11"],
    [new Date(2000, 10, 9, 14, 11), "14:11"],
    [new Date(2000, 10, 9, -2, 0), "22:00"],
    [new Date(2000, 10, 9, 0, 0), "00:00"],
    [new Date(2000, 10, 9, 8, 50), "08:50"],
    [new Date(2000, 10, 9, 8, 90), "09:30"],
  ])("returns the correct time string for a given number of minutes", (date: Date, expectedTimeString: string) => {
    expect(createTimeString(date)).toBe(expectedTimeString);
  });
});

describe("getDatesForRecurrencePattern", () => {
  it.each([
    // Basic weekly recurrence with non-inclusive start and end dates
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 1,
        startDate: new Date(2024, 4, 5, 18, 45), // Sunday May 5th
        endDate: new Date(2024, 5, 2), // Sunday June 2nd
      },
      [
        "5/6/2024 6:45:00 PM",
        "5/8/2024 6:45:00 PM",
        "5/13/2024 6:45:00 PM",
        "5/15/2024 6:45:00 PM",
        "5/20/2024 6:45:00 PM",
        "5/22/2024 6:45:00 PM",
        "5/27/2024 6:45:00 PM",
        "5/29/2024 6:45:00 PM",
      ],
    ],
    // Basic weekly recurrence with start date included in specified pattern
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 1,
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 5, 2), // Sunday June 2nd
      },
      [
        "5/6/2024 6:45:00 PM",
        "5/8/2024 6:45:00 PM",
        "5/13/2024 6:45:00 PM",
        "5/15/2024 6:45:00 PM",
        "5/20/2024 6:45:00 PM",
        "5/22/2024 6:45:00 PM",
        "5/27/2024 6:45:00 PM",
        "5/29/2024 6:45:00 PM",
      ],
    ],
    // Basic weekly recurrence with start and end date included in specified pattern
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 1,
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 5, 5), // Wednesday June 5th
      },
      [
        "5/6/2024 6:45:00 PM",
        "5/8/2024 6:45:00 PM",
        "5/13/2024 6:45:00 PM",
        "5/15/2024 6:45:00 PM",
        "5/20/2024 6:45:00 PM",
        "5/22/2024 6:45:00 PM",
        "5/27/2024 6:45:00 PM",
        "5/29/2024 6:45:00 PM",
        "6/3/2024 6:45:00 PM",
        "6/5/2024 6:45:00 PM",
      ],
    ],
    // Basic weekly recurrence with start and end date included in specified pattern and 'include_start_date' option redundant
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 1,
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 5, 5), // Wednesday June 5th
      },
      [
        "5/6/2024 6:45:00 PM",
        "5/8/2024 6:45:00 PM",
        "5/13/2024 6:45:00 PM",
        "5/15/2024 6:45:00 PM",
        "5/20/2024 6:45:00 PM",
        "5/22/2024 6:45:00 PM",
        "5/27/2024 6:45:00 PM",
        "5/29/2024 6:45:00 PM",
        "6/3/2024 6:45:00 PM",
        "6/5/2024 6:45:00 PM",
      ],
    ],
    // Basic weekly recurrence with start date not included in pattern but 'include start date option' selected
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 1,
        startDate: new Date(2024, 4, 5, 18, 45), // Sunday May 5th
        endDate: new Date(2024, 5, 2), // Sunday June 2nd
        includeSelectedDate: true,
      },
      [
        "5/5/2024 6:45:00 PM",
        "5/6/2024 6:45:00 PM",
        "5/8/2024 6:45:00 PM",
        "5/13/2024 6:45:00 PM",
        "5/15/2024 6:45:00 PM",
        "5/20/2024 6:45:00 PM",
        "5/22/2024 6:45:00 PM",
        "5/27/2024 6:45:00 PM",
        "5/29/2024 6:45:00 PM",
      ],
    ],
    // Bi weekly recurrence with non-inclusive start and end dates
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 2,
        startDate: new Date(2024, 4, 5, 18, 45), // Sunday May 5th
        endDate: new Date(2024, 5, 2), // Sunday June 2nd
      },
      ["5/6/2024 6:45:00 PM", "5/8/2024 6:45:00 PM", "5/20/2024 6:45:00 PM", "5/22/2024 6:45:00 PM"],
    ],
    // Bi weekly recurrence with start date included in specified pattern
    [
      {
        weeklyDays: ["monday", "wednesday"],
        period: 2,
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 5, 2), // Sunday June 2nd
      },
      ["5/6/2024 6:45:00 PM", "5/8/2024 6:45:00 PM", "5/20/2024 6:45:00 PM", "5/22/2024 6:45:00 PM"],
    ],
    // 4-weekly recurrence
    [
      {
        weeklyDays: ["wednesday"],
        period: 4,
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 8, 14), // Wed August 2nd
      },
      ["5/8/2024 6:45:00 PM", "5/5/2024 6:45:00 PM", "6/10/2024 6:45:00 PM"],
    ],
    // Basic monthly recurrence
    [
      {
        weeklyDays: ["wednesday"],
        period: 1,
        recurrenceType: "monthly",
        startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
        endDate: new Date(2024, 8, 14), // Wed August 2nd
      },
      ["5/8/2024 6:45:00 PM", "5/5/2024 6:45:00 PM", "6/10/2024 6:45:00 PM"],
    ],
  ])(
    "Should return the correct dates for the provided recurrence pattern",
    (recurrencePattern: RecurrencePattern, expectedDates: string[]) => {
      const dates = getDatesForRecurrencePattern(recurrencePattern);
      expect(dates.map((d) => `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`)).toEqual(expectedDates);
    },
  );

  // it("should return the correct dates for a daily recurrence pattern", () => {
  //   const dates = getDatesForRecurrencePattern(
  //     { weeklyDays: ["tuesday", "friday"], period: 2, endDate: "2024-04-01" },
  //     new Date(2024, 2, 7),
  //   );
  //   expect(dates.map((d) => d.toLocaleDateString())).toEqual(["3/8/2024", "3/19/2024", "3/22/2024"]);
  //   const dates2 = getDatesForRecurrencePattern(
  //     { weeklyDays: ["monday", "wednesday", "friday"], period: 1, endDate: "2024-01-19" },
  //     new Date(2024, 0, 1),
  //   );
  //   expect(dates2.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/1/2024",
  //     "1/3/2024",
  //     "1/5/2024",
  //     "1/8/2024",
  //     "1/10/2024",
  //     "1/12/2024",
  //     "1/15/2024",
  //     "1/17/2024",
  //     "1/19/2024",
  //   ]);

  //   const dates3 = getDatesForRecurrencePattern(
  //     { weeklyDays: ["monday", "wednesday", "friday"], period: 1, endDate: "2024-01-19" },
  //     new Date(2024, 0, 2),
  //   );
  //   expect(dates3.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/3/2024",
  //     "1/5/2024",
  //     "1/8/2024",
  //     "1/10/2024",
  //     "1/12/2024",
  //     "1/15/2024",
  //     "1/17/2024",
  //     "1/19/2024",
  //   ]);

  //   const dates4 = getDatesForRecurrencePattern(
  //     {
  //       weeklyDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  //       period: 1,
  //       endDate: "2024-01-13",
  //     },
  //     new Date(2024, 0, 1),
  //   );
  //   expect(dates4.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/1/2024",
  //     "1/2/2024",
  //     "1/3/2024",
  //     "1/4/2024",
  //     "1/5/2024",
  //     "1/6/2024",
  //     "1/7/2024",
  //     "1/8/2024",
  //     "1/9/2024",
  //     "1/10/2024",
  //     "1/11/2024",
  //     "1/12/2024",
  //     "1/13/2024",
  //   ]);
  // });

  // it("should return the correct dates for a daily recurrence pattern and include the starting date when specified", () => {
  //   const dates = getDatesForRecurrencePattern(
  //     { weeklyDays: ["tuesday", "friday"], period: 2, endDate: "2024-04-01", includeSelectedDate: true },
  //     new Date(2024, 2, 7),
  //   );
  //   expect(dates.map((d) => d.toLocaleDateString())).toEqual(["3/7/2024", "3/8/2024", "3/19/2024", "3/22/2024"]);

  //   const dates2 = getDatesForRecurrencePattern(
  //     {
  //       weeklyDays: ["monday", "wednesday", "friday"],
  //       period: 1,
  //       endDate: "2024-01-19",
  //       includeSelectedDate: true,
  //     },
  //     new Date(2024, 0, 1),
  //   );
  //   expect(dates2.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/1/2024",
  //     "1/3/2024",
  //     "1/5/2024",
  //     "1/8/2024",
  //     "1/10/2024",
  //     "1/12/2024",
  //     "1/15/2024",
  //     "1/17/2024",
  //     "1/19/2024",
  //   ]);

  //   const dates3 = getDatesForRecurrencePattern(
  //     {
  //       weeklyDays: ["monday", "wednesday", "friday"],
  //       period: 1,
  //       endDate: "2024-01-19",
  //       includeSelectedDate: true,
  //     },
  //     new Date(2024, 0, 2),
  //   );
  //   expect(dates3.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/2/2024",
  //     "1/3/2024",
  //     "1/5/2024",
  //     "1/8/2024",
  //     "1/10/2024",
  //     "1/12/2024",
  //     "1/15/2024",
  //     "1/17/2024",
  //     "1/19/2024",
  //   ]);

  //   const dates4 = getDatesForRecurrencePattern(
  //     {
  //       weeklyDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  //       period: 1,
  //       endDate: "2024-01-13",
  //       includeSelectedDate: true,
  //     },
  //     new Date(2024, 0, 1),
  //   );
  //   expect(dates4.map((d) => d.toLocaleDateString())).toEqual([
  //     "1/1/2024",
  //     "1/2/2024",
  //     "1/3/2024",
  //     "1/4/2024",
  //     "1/5/2024",
  //     "1/6/2024",
  //     "1/7/2024",
  //     "1/8/2024",
  //     "1/9/2024",
  //     "1/10/2024",
  //     "1/11/2024",
  //     "1/12/2024",
  //     "1/13/2024",
  //   ]);

  //   const dates5 = getDatesForRecurrencePattern(
  //     {
  //       weeklyDays: ["monday", "wednesday"],
  //       period: 1,
  //       endDate: "2024-05-25",
  //       includeSelectedDate: false,
  //     },
  //     new Date(2024, 3, 29),
  //   );
  //   expect(dates5.map((d) => d.toLocaleDateString())).toEqual([
  //     "4/29/2024",
  //     "5/1/2024",
  //     "5/6/2024",
  //     "5/8/2024",
  //     "5/13/2024",
  //     "5/15/2024",
  //     "5/20/2024",
  //     "5/22/2024",
  //   ]);
  // });

  // it("should return events with the correct time", () => {
  //   const inputDate = new Date(2024, 2, 7, 8, 30);
  //   const dates = getDatesForRecurrencePattern(
  //     { weeklyDays: ["tuesday", "friday"], period: 2, endDate: "2024-04-01" },
  //     inputDate,
  //   );
  //   expect(dates.map((d) => d.toLocaleDateString())).toEqual(["3/8/2024", "3/19/2024", "3/22/2024"]);
  //   expect(dates.every((d) => d.toLocaleTimeString() === inputDate.toLocaleTimeString())).toBe(true);
  // });
});
