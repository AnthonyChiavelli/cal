import { Prisma } from "@prisma/client";
import { TEST_USER_EMAIL } from "../__test__/constants"
import { Decimal } from "@prisma/client/runtime/library";


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