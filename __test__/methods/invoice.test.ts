/**
 * @jest-environment node
 */
import { getInvoices } from "../../src/app/methods/invoice";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { Prisma } from "@prisma/client";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

const mockInvoiceCollection: Prisma.InvoiceGetPayload<{ include: { family: true } }>[] = Array(25)
  .fill(0)
  .map((_, i) => ({
    id: i.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: TEST_USER_EMAIL,
    amount: new Prisma.Decimal(10 + i),
    paidAmount: new Prisma.Decimal(0),
    paid: i % 2 === 0,
    sent: false,
    familyId: `f${i}`,
    family: {
      id: `f${i}`,
      familyName: `Famfam${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: TEST_USER_EMAIL,
      notes: "",
      balance: new Prisma.Decimal(0),
    },
  }));

describe("getInvoices", () => {
  it("should return pages of invoices", async () => {
    const PAGE_SIZE = 10;

    prismaMock.invoice.findMany.mockResolvedValue(mockInvoiceCollection);

    for (let page = 1; page <= 10; page++) {
      await getInvoices({ page });

      expect(prismaMock.invoice.findMany).toHaveBeenCalledTimes(page);
      expect(prismaMock.invoice.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
        include: { family: true },
        where: {
          ownerId: { equals: TEST_USER_EMAIL },
        },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      });
    }
  });

  it("should return pages of current invoices", async () => {
    const PAGE_SIZE = 10;

    prismaMock.invoice.findMany.mockResolvedValue(mockInvoiceCollection);

    for (let page = 1; page <= 10; page++) {
      await getInvoices({ page });

      expect(prismaMock.invoice.findMany).toHaveBeenCalledTimes(page);
      expect(prismaMock.invoice.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
        include: { family: true },
        where: {
          ownerId: { equals: TEST_USER_EMAIL },
        },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      });
    }
  });

  it("should search on family name", async () => {
    const PAGE_SIZE = 10;

    prismaMock.invoice.findMany.mockResolvedValue(mockInvoiceCollection);

    await getInvoices({ page: 1, search: "bonk" });

    expect(prismaMock.invoice.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "desc",
      },
      include: { family: true },
      where: {
        ownerId: { equals: TEST_USER_EMAIL },
        family: { familyName: { contains: "bonk", mode: "insensitive" } },
      },
      skip: 0,
      take: PAGE_SIZE,
    });
  });
});
