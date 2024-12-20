import { ClassType, EventType, Prisma } from "@prisma/client";
import { TEST_USER_EMAIL } from "../__test__/constants"


export const mockEventFull: Prisma.EventGetPayload<{
    include: { eventStudents: { include: { student: { include: { family: true } } } } };
}> = {
    id: "1",
    scheduledFor: new Date("2022-01-01"),
    durationMinutes: 2,
    eventType: EventType.CLASS,
    createdAt: new Date(),
    updatedAt: new Date(),
    classType: ClassType.GROUP,
    parentName: null,
    studentName: null,
    completed: false,
    cancelledAt: null,
    recurrenceGroupId: null,
    referralSource: null,
    notes: "A class",
    ownerId: TEST_USER_EMAIL,
    eventStudents: [
        {
            id: "1",
            cost: new Prisma.Decimal(34),
            ownerId: TEST_USER_EMAIL,
            eventId: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
            invoiceId: null,
            cancelledAt: new Date(),
            studentId: "1",
            student: {
                id: "1",
                ownerId: TEST_USER_EMAIL,
                createdAt: new Date(),
                updatedAt: new Date(),
                gradeLevel: 1,
                notes: "",
                firstName: "John",
                lastName: "Smith",
                familyId: "f1",
                family: {
                    id: "f1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    balance: new Prisma.Decimal(0),
                    notes: "",
                    familyName: "Smith",
                    ownerId: TEST_USER_EMAIL,
                },
            },
        },
        {
            id: "2",
            cost: new Prisma.Decimal(78),
            ownerId: TEST_USER_EMAIL,
            eventId: "1",
            createdAt: new Date(),
            invoiceId: null,
            updatedAt: new Date(),
            cancelledAt: new Date(),
            studentId: "1",
            student: {
                id: "1",
                ownerId: TEST_USER_EMAIL,
                createdAt: new Date(),
                updatedAt: new Date(),
                gradeLevel: 1,
                notes: "",
                firstName: "John",
                lastName: "Smith",
                familyId: "f1",
                family: {
                    id: "f1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    balance: new Prisma.Decimal(0),
                    notes: "",
                    familyName: "Smith",
                    ownerId: TEST_USER_EMAIL,
                },
            },
        },
        {
            id: "3",
            cost: new Prisma.Decimal(12),
            ownerId: TEST_USER_EMAIL,
            eventId: "1",
            createdAt: new Date(),
            invoiceId: null,
            updatedAt: new Date(),
            cancelledAt: new Date(),
            studentId: "1",
            student: {
                id: "1",
                ownerId: TEST_USER_EMAIL,
                createdAt: new Date(),
                updatedAt: new Date(),
                gradeLevel: 1,
                notes: "",
                firstName: "John",
                lastName: "Smith",
                familyId: "f1",
                family: {
                    id: "f2",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    balance: new Prisma.Decimal(0),
                    notes: "",
                    familyName: "Smith",
                    ownerId: TEST_USER_EMAIL,
                },
            },
        },
    ],
};