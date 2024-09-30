/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { recurrenceTestCases } from "../support/test_data/recurring_schedule";
import { ClassType, Event, EventType, RecurrenceGroup } from "@prisma/client";
import { cancelEvent, createRecurrenceGroup, markEventCompleted, createEvent } from "@/app/actions/event";
import { RecurrencePattern } from "@/app/types";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test@examples.com" }, session: {} })),
}));

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
      where: { id: 1, ownerId: "test@examples.com" },
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
      data: { actionType: "CANCEL_EVENT", success: true, additionalData: { eventId: 1 }, ownerId: "test@examples.com" },
    });
  });
});

describe("markEventCompleted", () => {
  it("should mark an event complete", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", cancelledAt: null });

    // @ts-ignore
    await markEventCompleted(1, true);
    expect(prismaMock.event.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.update).toHaveBeenCalledWith({
      where: { id: 1, ownerId: "test@examples.com" },
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
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", cancelledAt: null });
    // @ts-ignore
    await markEventCompleted(1, true);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "MARK_COMPLETE_EVENT",
        success: true,
        additionalData: { eventId: 1 },
        ownerId: "test@examples.com",
      },
    });
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

describe("createEvent", () => {
  it("should create a basic event + action record", async () => {
    prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
    try {
      await createEvent({
        scheduledFor: new Date("2022-01-01"),
        duration: 2,
        eventType: EventType.CLASS,
        notes: "A class",
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

    expect(prismaMock.event.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.create).toHaveBeenCalledWith({
      data: {
        classType: ClassType.GROUP,
        durationMinutes: 2,
        eventStudents: {
          create: [
            {
              cost: 34,
              id: "1",
              ownerId: "test@examples.com",
            },
            {
              cost: 109,
              id: "2",
              ownerId: "test@examples.com",
            },
          ],
        },
        eventType: EventType.CLASS,
        notes: "A class",
        ownerId: "test@examples.com",
        scheduledFor: new Date("2022-01-01T00:00:00.000Z"),
      },
    });
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "SCHEDULE_EVENT",
        additionalData: {
          event: {
            id: "1",
          },
          formData: {
            duration: 2,
            eventStudents: [
              {
                cost: 34,
                id: "1",
              },
              {
                cost: 109,
                id: "2",
              },
            ],
            eventType: "CLASS",
            notes: "A class",
            scheduledFor: "2022-01-01T00:00:00.000Z",
          },
        },
        ownerId: "test@examples.com",
        success: true,
      },
    });
  });

  it("should create multiple connected events if supplied a recurrance schedule", async () => {
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
      expect(call[0].data.recurrenceGroupId).toBe("1");
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
        ownerId: "test@examples.com",
      },
    });
  });

  it.each(recurrenceTestCases)(
    "should generate event objects correctly according to the recurrence schedule",
    async (recurrencePattern: RecurrencePattern, expectedDates: string[]) => {
      prismaMock.event.create.mockResolvedValue({ id: "1" } as Event);
      prismaMock.recurrenceGroup.create.mockResolvedValue({ id: "1" } as Event);

      try {
        await createEvent({
          scheduledFor: new Date("2022-01-01"),
          duration: 2,
          eventType: EventType.CLASS,
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
