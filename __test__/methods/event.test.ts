/**
 * @jest-environment node
 */
import { mockFamilyWithStudents } from "../../mock_data/family";
import { getEvent, getEvents, getUninvoicedEvents } from "../../src/app/methods/event";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { Event } from "@prisma/client";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
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
        ownerId: TEST_USER_EMAIL,
      },
    });
  });
});

describe("getEvent", () => {
  it("should return an owner-filtered events", async () => {
    const mockEvent = { id: "1" };

    prismaMock.event.findFirst.mockResolvedValue([mockEvent as Event]);
    await getEvent("1");

    expect(prismaMock.event.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.event.findFirst).toHaveBeenCalledWith({
      where: { id: "1", ownerId: TEST_USER_EMAIL },
      include: { eventStudents: { include: { student: true } } },
    });
  });
});

describe("getUninvoicedEvents", () => {
  it("should correctly query for events that have not been paid", async () => {
    prismaMock.family.findFirstOrThrow.mockResolvedValue(mockFamilyWithStudents);
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    await getUninvoicedEvents();

    expect(prismaMock.eventStudent.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.eventStudent.findMany).toHaveBeenCalledWith({
      where: {
        ownerId: { equals: TEST_USER_EMAIL },
        invoiceId: { equals: null },
      },
      include: { event: true, student: { include: { family: true } } },
    });
  });
});
