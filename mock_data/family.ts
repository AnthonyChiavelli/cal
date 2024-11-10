import { Prisma } from "@prisma/client";
import { TEST_USER_EMAIL } from "../__test__/constants"
import { Decimal } from "@prisma/client/runtime/library";
import { mockInvoiceWithRelations } from "./invoice";


export const mockFamilyWithStudents: Prisma.FamilyGetPayload<{
    include: { students: true };
}> = {
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
};

export const mockFamilyWithRelations: Prisma.FamilyGetPayload<{
    include: { students: true, invoices: true, parents: true };
}> = {
    id: "f1",
    createdAt: new Date("10/09/1990"),
    updatedAt: new Date("10/09/1990"),
    ownerId: TEST_USER_EMAIL,
    balance: 3 as unknown as Decimal,
    familyName: "Smith",
    notes: "Some notes",
    parents: [
        {
            id: "1",
            createdAt: new Date("2021-01-01"),
            updatedAt: new Date("2021-01-01"),
            ownerId: "1",
            familyId: "1",
            firstName: "John",
            lastName: "Smith",
            phone: "+15554443333",
            email: "",
            isPrimary: true,
        },
        {
            id: "2",
            createdAt: new Date("2021-01-01"),
            updatedAt: new Date("2021-01-01"),
            ownerId: "1",
            familyId: "1",
            firstName: "Jane",
            lastName: "Smith",
            phone: "+17775553333",
            email: "",
            isPrimary: false,
        },
    ],
    invoices: [
        mockInvoiceWithRelations,
        { ...mockInvoiceWithRelations, id: 2 },
        { ...mockInvoiceWithRelations, id: 3 }
    ],
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
};