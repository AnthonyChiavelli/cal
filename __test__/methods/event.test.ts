/**
 * @jest-environment node
 */
import { prismaMock } from "../../src/singleton";
import { Event } from "@prisma/client";
import { getEvent, getEvents } from "@/app/methods/event";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: "test-user@example.com" }, session: {} })),
}));

describe("getEvents", () => {
  it("should return an owner-filtered list of events", async () => {
    const mockData = { scheduledFor: { gte: new Date(), lte: new Date() } };
    const mockEvents = { id: "1" };

    prismaMock.event.findMany.mockResolvedValue([mockEvents as Event]);
    await getEvents(mockData);

    expect(prismaMock.event.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.findMany).toHaveBeenCalledWith({
      orderBy: {
        scheduledFor: "asc",
      },
      include: { eventStudents: { include: { student: true } } },
      where: {
        ...mockData,
        ownerId: "test-user@example.com",
      },
    });
  });
});

describe("getEvent", () => {
  it("should return an owner-filtered events", async () => {
    const mockEvents = { id: "1" };

    prismaMock.event.findFirst.mockResolvedValue([mockEvents as Event]);
    await getEvent("1");

    expect(prismaMock.event.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.findFirst).toHaveBeenCalledWith({
      where: { id: "1", ownerId: "test-user@example.com" },
      include: { eventStudents: { include: { student: true } } },
    });
  });
});
