"use server";

import { Prisma } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

const PAGE_SIZE = 10;

export async function getInvoices(searchParams: {
  page?: Number;
  search?: string;
}): Promise<Prisma.InvoiceGetPayload<{ include: { family: true } }>[]> {
  const { user } = await getSessionOrFail();
  const page = Number(searchParams?.page) || 1;
  const query: Prisma.InvoiceFindManyArgs = {
    where: {
      ownerId: { equals: user.email },
    },
  };
  if (searchParams?.search && query.where) {
    query.where.family = { familyName: { contains: searchParams.search, mode: "insensitive" } };
  }

  return await prisma.invoice.findMany({
    ...query,
    include: {
      family: true,
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoiceCount(searchParams: { search?: string }): Promise<number> {
  const { user } = await getSessionOrFail();
  const query: Prisma.InvoiceCountArgs = {
    where: {
      ownerId: { equals: user.email },
    },
  };
  if (searchParams?.search && query.where) {
    query.where.family = { familyName: { contains: searchParams.search, mode: "insensitive" } };
  }

  return await prisma.invoice.count(query);
}

export async function getInvoice(invoiceId: number): Promise<Prisma.InvoiceGetPayload<{
  include: { family: { include: { parents: true; students: true } }; eventStudents: true };
}> | null> {
  const { user } = await getSessionOrFail();
  return await prisma.invoice.findFirst({
    where: { id: invoiceId, ownerId: user.email },
    include: { family: { include: { parents: true, students: true } }, eventStudents: true },
  });
}
