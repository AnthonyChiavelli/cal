/**
 * @jest-environment node
 */
import { createInvoice } from "../../src/app/actions/invoice";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { Invoice, Prisma } from "@prisma/client";
import { PaymentType, UserSettings } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { getUserSettings, updateUserSettings } from "@/app/actions/user";
import { getSessionOrFail } from "@/app/actions/util";
import { createFormDataFromObject } from "@/util/formdata";

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL } })),
}));
jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));
jest.mock("next/navigation");

const mockInvoice: Invoice = {
  id: "f1",
  createdAt: new Date("10/09/1990"),
  updatedAt: new Date("10/09/1990"),
  ownerId: "test@test.com",
  familyId: "f1",
  amount: new Prisma.Decimal(20),
  paidAmount: new Prisma.Decimal(0),
  sent: false,
  paid: false,
};

describe("createInvoice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have an auth guard", async () => {
    prismaMock.invoice.create.mockResolvedValue({id: "1"} as any)
    await createInvoice({ familyId: "1", amount: 23 });
    expect(getSessionOrFail).toHaveBeenCalledTimes(1);
  });

  it("should properly create an invoice + action record", async () => {
    prismaMock.invoice.create.mockResolvedValue(mockInvoice);
    await createInvoice({ familyId: "1", amount: 23 });

    expect(prismaMock.invoice.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.create).toHaveBeenCalledWith({
      data: {
        amount: new Prisma.Decimal("23"),
        family: {
          connect: {
            id: "1",
          },
        },
        owner: {
          connect: {
            email: "test@example.com",
          },
        },
        paid: false,
        paidAmount: 0,
        sent: false,
      },
    });

    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "CREATE_INVOICE",
        additionalData: {
          formData: {
            amount: 23,
            familyId: "1",
          },
        },
        ownerId: "test@example.com",
        success: true,
      },
    });
  });

  it("should properly create an action record upon failure", async () => {
    prismaMock.invoice.create.mockRejectedValue(false);
    try {
      await createInvoice({ familyId: "1", amount: 23 });
    } catch (e) {}
    expect(prismaMock.actionRecord.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.actionRecord.create).toHaveBeenCalledWith({
      data: {
        actionType: "CREATE_INVOICE",
        additionalData: {
          formData: {
            amount: 23,
            familyId: "1",
          },
        },
        ownerId: "test@example.com",
        success: false,
      },
    });
  });
});
