/**
 * @jest-environment node
 */
import { mockInvoiceWithRelations } from "../../mock_data/invoice";
import { createInvoice } from "../../src/app/actions/invoice";
import { getSessionOrFail } from "../../src/app/actions/util";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { Invoice, InvoiceStatus, Prisma } from "@prisma/client";

jest.mock("@auth0/nextjs-auth0", () => ({
  getSession: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL } })),
}));
jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));
jest.mock("next/navigation");

describe("createInvoice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have an auth guard", async () => {
    prismaMock.invoice.create.mockResolvedValue({ id: "1" } as any);
    await createInvoice({
      familyId: "f1",
      amount: 90,
      eventStudentIds: [],
    });
    expect(getSessionOrFail).toHaveBeenCalledTimes(1);
  });

  it("should properly create an invoice + action record", async () => {
    prismaMock.invoice.create.mockResolvedValue(mockInvoiceWithRelations);
    await createInvoice({
      familyId: "f1",
      amount: 90,
      eventStudentIds: [],
    });

    expect(prismaMock.invoice.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.create).toHaveBeenCalledWith({
      data: {
        amount: 0,
        customPriceModifier: 0,
        eventStudents: {
          connect: [],
        },
        family: {
          connect: {
            id: "f1",
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
            amount: 90,
            eventStudentIds: [],
            familyId: "f1",
          },
        },
        ownerId: "test@example.com",
        success: true,
      },
    });
  });

  // TODO examples with actual eventStudents
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
