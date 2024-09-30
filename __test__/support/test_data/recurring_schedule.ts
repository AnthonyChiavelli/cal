import { RecurrencePattern } from "@/app/types";

const recurrenceTestCases: Array<[RecurrencePattern, Array<string>]> = [
  [
    {
      weeklyDays: ["monday", "wednesday"],
      period: 1,
      startDate: new Date(2024, 4, 5, 18, 45), // Sunday May 5th
      endDate: new Date(2024, 5, 2, 18, 45), // Sunday June 2nd
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
      endDate: new Date(2024, 5, 2, 18, 45), // Sunday June 2nd
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
      endDate: new Date(2024, 5, 5, 18, 45), // Wednesday June 5th
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
      endDate: new Date(2024, 5, 5, 18, 45), // Wednesday June 5th
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
      endDate: new Date(2024, 8, 14), // Wed September 14th
    },
    [
      "5/8/2024 6:45:00 PM",
      "6/5/2024 6:45:00 PM",
      "7/3/2024 6:45:00 PM",
      "7/31/2024 6:45:00 PM",
      "8/28/2024 6:45:00 PM",
    ],
  ],
  // 4-weekly recurrence with end date in pattern
  [
    {
      weeklyDays: ["wednesday"],
      period: 4,
      startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
      endDate: new Date(2024, 7, 28, 18, 45), // Wed September 14th
    },
    [
      "5/8/2024 6:45:00 PM",
      "6/5/2024 6:45:00 PM",
      "7/3/2024 6:45:00 PM",
      "7/31/2024 6:45:00 PM",
      "8/28/2024 6:45:00 PM",
    ],
  ],
  // Basic monthly recurrence
  [
    {
      period: 1,
      recurrenceType: "monthly",
      startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
      endDate: new Date(2024, 8, 14, 18, 45), // Wed September 14th
    },
    ["5/6/2024 6:45:00 PM", "6/6/2024 6:45:00 PM", "7/6/2024 6:45:00 PM", "8/6/2024 6:45:00 PM", "9/6/2024 6:45:00 PM"],
  ],
  // Monthly recurrence with end date in pattern
  [
    {
      period: 1,
      recurrenceType: "monthly",
      startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
      endDate: new Date(2024, 8, 6, 18, 45), // Monday September 6th
    },
    ["5/6/2024 6:45:00 PM", "6/6/2024 6:45:00 PM", "7/6/2024 6:45:00 PM", "8/6/2024 6:45:00 PM", "9/6/2024 6:45:00 PM"],
  ],
];

export { recurrenceTestCases };
