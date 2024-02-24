import "@testing-library/jest-dom";
import { getAdjacentMonthString, getDaysForCalendarMonthGrid, parseDateString, parseMonthString, createDateString } from "../../src/util/calendar";

describe("getDaysForCalendarMonthGrid", () => {
  it("returns the correct days for Jan 2022 (first month of year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(1, 2022);
    const expected = [
      {date: "2021-12-27", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-12-28", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-12-29", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-12-30", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-12-31", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-01-1", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-2", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-3", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-4", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-5", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-6", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-7", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-8", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-9", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-10", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-11", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-12", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-13", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-14", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-15", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-16", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-17", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-18", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-19", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-20", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-21", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-22", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-23", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-24", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-25", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-26", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-27", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-28", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-29", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-30", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-01-31", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-1", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-2", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-3", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-4", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-5", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-6", isCurrentMonth: false, events: [], isToday: false},
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Feb 2020 (a month in the middle of a year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(2, 2022);
    const expected = [
      {date: "2022-01-31", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-02-1", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-2", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-3", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-4", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-5", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-6", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-7", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-8", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-9", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-10", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-11", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-12", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-13", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-14", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-15", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-16", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-17", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-18", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-19", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-20", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-21", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-22", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-23", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-24", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-25", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-26", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-27", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-02-28", isCurrentMonth: true, events: [], isToday: false},
      {date: "2022-03-1", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-03-2", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-03-3", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-03-4", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-03-5", isCurrentMonth: false, events: [], isToday: false},
      {date: "2022-03-6", isCurrentMonth: false, events: [], isToday: false},
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Dec 2020 (a month at the end of a year)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(12, 2020);
    const expected = [
      {date: "2020-11-30", isCurrentMonth: false, events: [], isToday: false},
      {date: "2020-12-1", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-2", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-3", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-4", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-5", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-6", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-7", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-8", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-9", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-10", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-11", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-12", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-13", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-14", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-15", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-16", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-17", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-18", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-19", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-20", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-21", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-22", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-23", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-24", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-25", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-26", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-27", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-28", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-29", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-30", isCurrentMonth: true, events: [], isToday: false},
      {date: "2020-12-31", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-01-1", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-01-2", isCurrentMonth: false, events: [], isToday: false},
      {date: "2021-01-3", isCurrentMonth: false, events: [], isToday: false},
    ];
    expect(calendarDays).toEqual(expected);
  });

  it("returns the correct days for Feb 2021 (a short month, with no filler)", () => {
    const calendarDays = getDaysForCalendarMonthGrid(2, 2021);
    const expected = [
      {date: "2021-02-1", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-2", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-3", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-4", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-5", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-6", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-7", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-8", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-9", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-10", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-11", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-12", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-13", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-14", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-15", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-16", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-17", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-18", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-19", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-20", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-21", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-22", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-23", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-24", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-25", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-26", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-27", isCurrentMonth: true, events: [], isToday: false},
      {date: "2021-02-28", isCurrentMonth: true, events: [], isToday: false},
    ];
    expect(calendarDays).toEqual(expected);
  });
});


describe('getAdjacentMonthString', () => {
  it('correctly handles adjacent months within the same year', () => {
    expect(getAdjacentMonthString('2024-06', 1)).toEqual('2024-07')
    expect(getAdjacentMonthString('2024-06', -1)).toEqual('2024-05')
  })

  it('correctly handles adjacent months spanning years', () => {
    expect(getAdjacentMonthString('2024-12', 1)).toEqual('2025-01')
    expect(getAdjacentMonthString('2024-01', -1)).toEqual('2023-12')
  })
})

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

describe("parseDateString", () => {
  it.each([
    ["2022-01-15", [2022, 1, 15]],
    ["2023-12-25", [2023, 12, 25]],
    ["2021-09-01", [2021, 9, 1]],
    ["2021-09-1", [2021, 9, 1]],
    ["2021-9-1", [2021, 9, 1]],
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
});import { getAdjacentDateString } from "../../src/util/calendar";


describe("getAdjacentDateString", () => {
  it("returns the correct adjacent date when direction is 1", () => {
    let currentDateString = "2022-01-15";
    for (let i = 1; i < 50; i++) {
      const adjacentDateString = getAdjacentDateString(currentDateString, 1);
      expect(() => parseDateString(adjacentDateString)).not.toThrow()
      const currentDate = new Date(currentDateString)
      const nextDate = new Date(adjacentDateString)
      expect(nextDate.getTime() - currentDate.getTime()).toEqual(24 * 60 * 60 * 1000)
      currentDateString = adjacentDateString;
    }
  });

  it("returns the correct adjacent date when direction is -1", () => {
    let currentDateString = "2022-01-15";
    for (let i = 1; i < 50; i++) {
      const adjacentDateString = getAdjacentDateString(currentDateString, -1);
      expect(() => parseDateString(adjacentDateString)).not.toThrow()
      const currentDate = new Date(currentDateString)
      const nextDate = new Date(adjacentDateString)
      expect(currentDate.getTime() - nextDate.getTime()).toEqual(24 * 60 * 60 * 1000)
      currentDateString = adjacentDateString;
    }
  });
});import "@testing-library/jest-dom";


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