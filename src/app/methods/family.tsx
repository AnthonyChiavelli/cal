"use server";

// TODO make this work
import { Prisma } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

export async function getFamilies(searchParams: {
  search?: string;
}): Promise<Prisma.FamilyGetPayload<{ include: { parents: true; students: true; invoices: true } }>[]> {
  const { user } = await getSessionOrFail();
  const query: any = {
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
        { parents: { some: {firstName: {contains: searchParams.search, mode: "insensitive"}}} },
        { parents: { some: {lastName: {contains: searchParams.search, mode: "insensitive"}}} },
        { parents: { some: {phone: {contains: searchParams.search, mode: "insensitive"}}} },
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


// export async function getStudent(studentId: string) {
//   const { user } = await getSessionOrFail();
//   return await prisma.student.findFirst({ where: { id: studentId, ownerId: user.email } });
// }
