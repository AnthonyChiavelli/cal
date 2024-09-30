import { User } from "@prisma/client";
import { env } from "process";
import prisma from "@/db";

export const dynamic = "force-dynamic";

const mockData = {
  students: [
    {
      firstName: "Cranjis",
      lastName: "McBasketball",
    },
    {
      firstName: "Nougat",
      lastName: "Zarathustra",
    },
    {
      firstName: "Quenjamin",
      lastName: "Flopjack",
    },
    {
      firstName: "Slosage",
      lastName: "Hamlander",
    },
  ],
};

export const POST = async (request: any) => {
  const bearerToken = request.headers.get("authorization");
  if (bearerToken !== env.CYPRESS_API_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (process.env.AUTH0_USERNAME === undefined || process.env.AUTH0_PASSWORD === undefined) {
    return new Response("Missing AUTH0_USERNAME or AUTH0_PASSWORD", { status: 500 });
  }

  // Clear old data first (TODO: call common function?)
  await prisma.user.delete({
    where: {
      email: env.AUTH0_USERNAME,
    },
  });
  await prisma.student.deleteMany({
    where: {
      ownerId: env.AUTH0_USERNAME,
    },
  });
  await prisma.event.deleteMany({
    where: {
      ownerId: env.AUTH0_USERNAME,
    },
  });

  let testUser: User;
  try {
    testUser = await prisma.user.findFirstOrThrow({
      where: {
        email: env.AUTH0_USERNAME,
      },
    });
  } catch (error) {
    testUser = await prisma.user.create({
      data: {
        email: process.env.AUTH0_USERNAME,
        password: process.env.AUTH0_PASSWORD,
        displayName: "Anthony Chiavelli",
      },
    });
  }
  for (const student of mockData.students) {
    const existingStudent = await prisma.student.findFirst({
      where: {
        firstName: student.firstName,
        lastName: student.lastName,
        ownerId: testUser.email,
      },
    });

    if (!existingStudent) {
      await prisma.student.create({
        data: {
          ownerId: testUser.email,
          gradeLevel: 8,
          notes: "Student",
          ...student,
        },
      });
    }
  }
  return Response.json({ success: true });
};
