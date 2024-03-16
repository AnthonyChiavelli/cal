/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { cancelEvent, markEventCompleted } from "@/app/actions/events";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test@examples.com" }, session: {} })),
}));

describe("cancelEvent", () => {
  it("should cancel an event", async () => {
    // @ts-ignore
    prismaMock.event.findFirstOrThrow.mockResolvedValue({ id: "1", completed: false });
    // @ts-ignore
    await cancelEvent(1);
    expect(prismaMock.event.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { cancelledAt: expect.any(Date) } });
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
      data: { actionType: "CANCEL_EVENT", success: true, additionalData: { eventId: 1 } },
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
    expect(prismaMock.event.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { completed: true } });
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
      data: { actionType: "MARK_COMPLETE_EVENT", success: true, additionalData: { eventId: 1 } },
    });
  });
});
