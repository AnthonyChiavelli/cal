"use server";

import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

const PAGE_SIZE = 10;

export async function getStudents(searchParams: { page?: Number; search?: string }) {
  const { user } = await getSessionOrFail();
  const page = Number(searchParams?.page) || 1;
  const query: any = {
    where: {
      ownerId: { equals: user.email },
    },
  };
  if (searchParams?.search) {
    query.where = {
      OR: [
        { firstName: { contains: searchParams.search, mode: "insensitive" } },
        { lastName: { contains: searchParams.search, mode: "insensitive" } },
        { notes: { contains: searchParams.search, mode: "insensitive" } },
      ],
      ownerId: { equals: user.email },
    };
  }

  return await prisma.student.findMany({
    ...query,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTotalStudentCount(searchParams: { search?: string }) {
  const { user } = await getSessionOrFail();
  const query: any = {
    where: {
      ownerId: { equals: user.email },
    },
  };
  if (searchParams?.search) {
    query.where = {
      OR: [
        { firstName: { contains: searchParams.search, mode: "insensitive" } },
        { lastName: { contains: searchParams.search, mode: "insensitive" } },
        { notes: { contains: searchParams.search, mode: "insensitive" } },
      ],
      ownerId: { equals: user.email },
    };
  }
  return await prisma.student.count(query);
}

export async function getAllStudents() {
  const { user } = await getSessionOrFail();

  return await prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      ownerId: {
        equals: user.email,
      },
    },
  });
}

export async function getStudent(studentId: string) {
  const { user } = await getSessionOrFail();
  return await prisma.student.findFirst({ where: { id: studentId, ownerId: user.email } });
}
