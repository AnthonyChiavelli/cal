/**
 * @jest-environment node
 */
import { mockEventFull } from "../../mock_data/event";
import { cancelEvent, createRecurrenceGroup, markEventCompleted, createEvent } from "../../src/app/actions/event";
import { RecurrencePattern } from "../../src/app/types";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { recurrenceTestCases } from "../support/test_data/recurring_schedule";
import { ClassType, Event, EventType, Prisma, RecurrenceGroup } from "@prisma/client";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

describe("createEvent", () => {
  it("should create a basic class event", async () => {
    prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
    try {
      await createEvent({
        scheduledFor: new Date("2022-01-01"),
        duration: 2,
        eventType: EventType.CLASS,
        classType: ClassType.GROUP,
        notes: "A class",
        eventStudents: [
          {
            studentId: "1",
            cost: 34,
          },
          {
            studentId: "2",
            cost: 109,
          },
        ],
      });
    } catch (e) {
      if (e.message !== "NEXT_REDIRECT") {
        throw e;
      }
    }

    expect(prismaMock.event.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: {
        classType: ClassType.GROUP,
        durationMinutes: 2,
        eventStudents: {
          create: [
            {
              cost: 34,
              studentId: "1",
              ownerId: TEST_USER_EMAIL,
            },
            {
              cost: 109,
              studentId: "2",
              ownerId: TEST_USER_EMAIL,
            },
          ],
        },
        eventType: EventType.CLASS,
        notes: "A class",
        owner: {
          connect: {
            email: TEST_USER_EMAIL,
          },
        },
        scheduledFor: new Date("2022-01-01T00:00:00.000Z"),
      },
    });
  });

  it("should create a basic consultation event", async () => {
    prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
    try {
      await createEvent({
        scheduledFor: new Date("2022-01-01"),
        duration: 2,
        eventType: EventType.CONSULTATION,
        notes: "A consultation",
        classType: ClassType.GROUP,
        eventStudents: [],
      });
    } catch (e) {
      if (e.message !== "NEXT_REDIRECT") {
        throw e;
      }
    }

    expect(prismaMock.event.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: {
        eventType: EventType.CONSULTATION,
        classType: ClassType.GROUP,
        notes: "A consultation",
        durationMinutes: 2,
        owner: {
          connect: {
            email: TEST_USER_EMAIL,
          },
        },
        scheduledFor: new Date("2022-01-01T00:00:00.000Z"),
      },
    });
  });

  it("should create multiple connected class events if supplied a recurrance schedule", async () => {
    prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
    prismaMock.recurrenceGroup.create.mockResolvedValue({ id: "1" } as Event);

    const recurrencePattern: RecurrencePattern = {
      recurrenceType: "weekly",
      weeklyDays: ["monday", "wednesday"],
      period: 1,
      startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
      endDate: new Date(2024, 5, 2, 18, 45), // Sunday June 2nd
    };

    try {
      await createEvent({
        scheduledFor: new Date("2022-01-01"),
        duration: 2,
        eventType: EventType.CLASS,
        notes: "A class",
        recurrencePattern,
        eventStudents: [
          {
            id: "1",
            cost: 34,
          },
          {
            id: "2",
            cost: 109,
          },
        ],
      });
    } catch (e) {
      if (e.message !== "NEXT_REDIRECT") {
        throw e;
      }
    }

    expect(prismaMock.event.create).toHaveBeenCalledTimes(8);
    prismaMock.event.create.mock.calls.forEach((call) => {
      expect(call[0].data.recurrenceGroup?.connect?.id).toBe("1");
    });
  });

  it("should delete the recurrence group if an error occurs", async () => {
    prismaMock.event.create.mockRejectedValue(new Error("event create error"));
    prismaMock.recurrenceGroup.create.mockResolvedValue({ id: "1" } as Event);

    const recurrencePattern: RecurrencePattern = {
      recurrenceType: "weekly",
      weeklyDays: ["monday", "wednesday"],
      period: 1,
      startDate: new Date(2024, 4, 6, 18, 45), // Monday May 6th
      endDate: new Date(2024, 5, 2, 18, 45), // Sunday June 2nd
    };

    try {
      await createEvent({
        scheduledFor: new Date("2022-01-01"),
        duration: 2,
        eventType: EventType.CLASS,
        notes: "A class",
        recurrencePattern,
        eventStudents: [
          {
            id: "1",
            cost: 34,
          },
          {
            id: "2",
            cost: 109,
          },
        ],
      });
    } catch (e) {
      if (e.message !== "NEXT_REDIRECT" && e.message !== "event create error") {
        throw e;
      }
    }
    expect(prismaMock.recurrenceGroup.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.recurrenceGroup.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(prismaMock.event.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "CREATE_RECURRING_EVENT",
        success: false,
        additionalData: {
          details: "Error occured during recurrent event creation, all events deleted",
          error: "event create error",
        },
        owner: {
          connect: {
            email: TEST_USER_EMAIL,
          },
        },
      },
    });
  });

  it.each(recurrenceTestCases)(
    "should generate class event objects correctly according to the recurrence schedule",
    async (recurrencePattern: RecurrencePattern, expectedDates: string[]) => {
      prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
      prismaMock.recurrenceGroup.create.mockResolvedValue({ id: "1" } as Event);

      try {
        await createEvent({
          scheduledFor: new Date("2022-01-01"),
          duration: 2,
          eventType: EventType.CLASS,
          classType: ClassType.GROUP,
          notes: "A class",
          recurrencePattern,
          eventStudents: [],
        });
      } catch (e) {
        if (e.message !== "NEXT_REDIRECT") {
          throw e;
        }
      }

      expect(prismaMock.event.create).toHaveBeenCalledTimes(expectedDates.length);
      prismaMock.event.create.mock.calls.forEach((call, i) => {
        expect((call[0].data.scheduledFor as Date).toISOString()).toBe(new Date(expectedDates[i]).toISOString());
      });
    },
  );
});

describe("cancelEvent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should cancel an event", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", completed: false });
    // @ts-ignore
    await cancelEvent(1);
    expect(prismaMock.event.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.update).toHaveBeenCalledWith({
      where: {
        id: 1,
        ownerId: TEST_USER_EMAIL,
      },
      data: { cancelledAt: expect.anything() },
    });
  });

  it("should refuse to cancel an event that has been marked as complete", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", completed: true });

    // @ts-ignore
    expect(async () => await cancelEvent(1)).rejects.toThrow("Cannot cancel an event that has been marked as complete");
  });

  it("should generate an ActionRecord", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", completed: false });

    // @ts-ignore
    await cancelEvent(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "CANCEL_EVENT",
        success: true,
        additionalData: { eventId: 1 },
        ownerId: TEST_USER_EMAIL,
      },
    });
  });
});

describe("markEventCompleted", () => {
  it("should mark an event complete", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue(mockEventFull);

    // @ts-ignore
    await markEventCompleted(1, true);
    expect(prismaMock.event.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.update).toHaveBeenCalledWith({
      where: {
        id: 1,
        ownerId: TEST_USER_EMAIL,
      },
      data: { completed: true },
    });
  });

  it("should refuse to mark an event complete if it has been cancelled", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", cancelledAt: new Date() });
    // @ts-ignore
    expect(async () => await markEventCompleted(1, true)).rejects.toThrow("Cannot mark a cancelled event as complete");
  });

  it("should generate an ActionRecord", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue(mockEventFull);
    // @ts-ignore
    await markEventCompleted(1, true);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "MARK_COMPLETE_EVENT",
        success: true,
        additionalData: { eventId: 1 },
        ownerId: TEST_USER_EMAIL,
      },
    });
  });

  it("should update all associated family balances in a transaction", async () => {
    // @ts-ignore
    prismaMock.event.update.mockImplementation((a) => a);
    // @ts-ignore
    prismaMock.family.update.mockImplementation((a) => a);
    prismaMock.event.findFirstOrThrow.mockResolvedValue(mockEventFull);
    await markEventCompleted(1, true);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.$transaction).toHaveBeenCalledWith([
      { data: { completed: true }, where: { id: 1, ownerId: "test@example.com" } },
      { data: { balance: { increment: new Prisma.Decimal(34) } }, where: { id: "f1" } },
      { data: { balance: { increment: new Prisma.Decimal(78) } }, where: { id: "f1" } },
      { data: { balance: { increment: new Prisma.Decimal(12) } }, where: { id: "f2" } },
    ]);
  });
});

describe("createRecurrenceGroup", () => {
  it("should create a recurrence group", async () => {
    prismaMock.recurrenceGroup.create.mockResolvedValue({ id: "1" } as RecurrenceGroup);
    const res = await createRecurrenceGroup();
    expect(prismaMock.recurrenceGroup.create).toHaveBeenCalledTimes(1);
    expect(res.id).toBe("1");
  });
});
