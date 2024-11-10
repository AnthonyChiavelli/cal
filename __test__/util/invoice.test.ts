import { renderClientInvoiceTemplate } from "../../src/util/invoice";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import "@testing-library/jest-dom";

const mockInvoice: Prisma.InvoiceGetPayload<{ include: { family: { include: { parents: true; students: true } } } }> = {
  id: 1,
  createdAt: new Date("10/09/1990"),
  updatedAt: new Date("10/09/1990"),
  ownerId: "test@test.com",
  familyId: "f1",
  amount: new Prisma.Decimal(20),
  status: InvoiceStatus.CREATED,
  paidAmount: new Prisma.Decimal(0),
  sent: false,
  paid: false,
  family: {
    id: "f1",
    createdAt: new Date("10/09/1990"),
    updatedAt: new Date("10/09/1990"),
    ownerId: "test@test.com",
    balance: 90 as unknown as Decimal,
    familyName: "Smith",
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
    notes: "Some notes",
    students: [
      {
        id: "s1",
        createdAt: new Date("10/09/1990"),
        updatedAt: new Date("10/09/1990"),
        ownerId: "test@test.com",
        familyId: "f1",
        firstName: "Johnny",
        lastName: "Smith",
        gradeLevel: 1,
        notes: "",
      },
    ],
  },
};

describe("renderClientInvoiceTemplate", () => {
  it("should replace template tags with values", () => {
    expect(
      renderClientInvoiceTemplate(
        "Hi {familyName}, you owe me {invoiceAmount}. You are {parent1FirstName} {parent1LastName} and {parent2FirstName} {parent2LastName}. Your total balance is {totalBalance}. Please send me my monies, {familyName} family!",
        mockInvoice,
      ),
    ).toBe(
      "Hi Smith, you owe me $20.00. You are John Smith and Jane Smith. Your total balance is $90.00. Please send me my monies, Smith family!",
    );
  });
});
