/**
 * @jest-environment node
 */
import { getInvoice, getInvoiceCount, getInvoices } from "../../src/app/methods/invoice";
import { prismaMock } from "../../src/singleton";
import { TEST_USER_EMAIL } from "../constants";
import { Prisma } from "@prisma/client";

jest.mock("../../src/app/actions/util", () => ({
  getSessionOrFail: jest.fn(() => Promise.resolve({ user: { email: TEST_USER_EMAIL }, session: {} })),
}));

const mockInvoiceCollection: Prisma.InvoiceGetPayload<{ include: { family: true } }>[] = Array(25)
  .fill(0)
  .map((_, i) => ({
    id: i,
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: TEST_USER_EMAIL,
    customPriceModifier: new Prisma.Decimal(0),
    amount: new Prisma.Decimal(10 + i),
    status: "CREATED",
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

describe("getInvoiceCount", () => {
  it("should make the proper query to return the total count of invoices", async () => {
    prismaMock.invoice.count.mockResolvedValueOnce(15);
    await getInvoiceCount({});
    expect(prismaMock.invoice.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.count).toHaveBeenCalledWith({
      where: {
        ownerId: { equals: TEST_USER_EMAIL },
      },
    });
  });
  it("should make the proper query to return the total count of invoices filtered based on a query", async () => {
    prismaMock.invoice.count.mockResolvedValueOnce(15);
    await getInvoiceCount({ search: "Banana" });
    expect(prismaMock.invoice.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.count).toHaveBeenCalledWith({
      where: {
        ownerId: { equals: TEST_USER_EMAIL },
        family: {
          familyName: { contains: "Banana", mode: "insensitive" },
        },
      },
    });
  });
});

describe("getInvoice", () => {
  it("should make the proper query to return an invoice by ID", async () => {
    prismaMock.invoice.findFirstOrThrow.mockResolvedValueOnce(mockInvoiceCollection[0]);
    await getInvoice(12);
    expect(prismaMock.invoice.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.findFirst).toHaveBeenCalledWith({
      where: { id: 12, ownerId: TEST_USER_EMAIL },
      include: { eventStudents: true, family: { include: { parents: true, students: true } } },
    });
  });
});

describe("getInvoiceCount", () => {
  it("should make the proper query count invoices, without a search query", async () => {
    prismaMock.invoice.findFirstOrThrow.mockResolvedValueOnce(mockInvoiceCollection[0]);
    await getInvoiceCount({});
    expect(prismaMock.invoice.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.count).toHaveBeenCalledWith({
      where: { ownerId: { equals: TEST_USER_EMAIL } },
    });
  });

  it("should make the proper query count invoices, with a search query", async () => {
    prismaMock.invoice.findFirstOrThrow.mockResolvedValueOnce(mockInvoiceCollection[0]);
    await getInvoiceCount({ search: "Scrumpty" });
    expect(prismaMock.invoice.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.invoice.count).toHaveBeenCalledWith({
      where: {
        ownerId: { equals: TEST_USER_EMAIL },
        family: { familyName: { contains: "Scrumpty", mode: "insensitive" } },
      },
    });
  });
});
