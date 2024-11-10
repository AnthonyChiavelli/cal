import { InvoiceStatus, Prisma } from "@prisma/client";
import { TEST_USER_EMAIL } from "../__test__/constants";
import { mockEventFull } from "./event";
import { Decimal } from "@prisma/client/runtime/library";

export const mockInvoiceWithRelations: Prisma.InvoiceGetPayload<{ include: { family: {include: {students: true}}, eventStudents: { include: { event: true, student: true } } } }> = {
    id: 1,
    createdAt: new Date("10/09/1990"),
    updatedAt: new Date("10/09/1990"),
    ownerId: "test@test.com",
    familyId: "f1",
    amount: new Prisma.Decimal(20),
    paidAmount: new Prisma.Decimal(0),
    customPriceModifier: new Prisma.Decimal(0),
    status: InvoiceStatus.CREATED,
    sent: false,
    paid: false,
    family: {
        id: "f1",
        createdAt: new Date("10/09/1990"),
        updatedAt: new Date("10/09/1990"),
        ownerId: TEST_USER_EMAIL,
        balance: 3 as unknown as Decimal,
        familyName: "Smith",
        notes: "Some notes",
        students: [
            {
                id: "s1",
                createdAt: new Date("10/09/1990"),
                updatedAt: new Date("10/09/1990"),
                ownerId: TEST_USER_EMAIL,
                familyId: "f1",
                firstName: "Johnny",
                lastName: "Smith",
                gradeLevel: 1,
                notes: "",
            },
            {
                id: "s2",
                createdAt: new Date("10/09/1990"),
                updatedAt: new Date("10/09/1990"),
                ownerId: TEST_USER_EMAIL,
                familyId: "f1",
                firstName: "Plonny",
                lastName: "Smith",
                gradeLevel: 12,
                notes: "",
            },
        ],
    },
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
            },
            event: {
                ...mockEventFull,
                id: 'e1'
            }
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
            },
            event: {
                ...mockEventFull,
                id: 'e2'
            }
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
            },
            event: {
                ...mockEventFull,
                id: 'e3'
            }
        },
    ],
}