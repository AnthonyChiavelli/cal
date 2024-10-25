"use server";

import { Prisma } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

export async function getFamilies(searchParams: {
  search?: string;
}): Promise<Prisma.FamilyGetPayload<{ include: { parents: true; students: true; invoices: true } }>[]> {
  const { user } = await getSessionOrFail();
  const query: Prisma.FamilyFindManyArgs = {
    where: {
      ownerId: { equals: user.email },
    },
    include: {
      parents: true,
      students: true,
    },
  };
  if (searchParams?.search) {
    query.where = {
      OR: [
        { familyName: { contains: searchParams.search, mode: "insensitive" } },
        { parents: { some: { firstName: { contains: searchParams.search, mode: "insensitive" } } } },
        { parents: { some: { lastName: { contains: searchParams.search, mode: "insensitive" } } } },
        { parents: { some: { phone: { contains: searchParams.search, mode: "insensitive" } } } },
        { notes: { contains: searchParams.search, mode: "insensitive" } },
      ],
      ownerId: { equals: user.email },
    };
  }

  return (await prisma.family.findMany({
    ...query,
    orderBy: { createdAt: "desc" },
    include: {
      parents: true,
      students: true,
      invoices: true,
    },
  })) as Prisma.FamilyGetPayload<{ include: { parents: true; students: true; invoices: true } }>[];
}

export async function getFamily(
  familyId: string,
): Promise<Prisma.FamilyGetPayload<{ include: { parents: true; students: true; invoices: true } }> | null> {
  const { user } = await getSessionOrFail();
  return await prisma.family.findUnique({
    where: {
      id: familyId,
      ownerId: user.email,
    },
    include: {
      parents: true,
      students: true,
      invoices: true,
    },
  });
}
