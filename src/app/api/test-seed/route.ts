import { User } from "@prisma/client";
import { env } from "process";
import prisma from "@/db";
import { clearAllSeedData } from "@/util/db";

export const dynamic = "force-dynamic";

const mockData = {
  student: [
    {
      firstName: "Cranjis",
      lastName: "McBasketball",
      gradeLevel: 8,
      notes: "Student",
    },
    {
      firstName: "Nougat",
      lastName: "Zarathustra",
      gradeLevel: 8,
      notes: "Student",
    },
    {
      firstName: "Quenjamin",
      lastName: "Flopjack",
      gradeLevel: 8,
      notes: "Student",
    },
    {
      firstName: "Slosage",
      lastName: "Hamlander",
      gradeLevel: 8,
      notes: "Test Student 4",
    },
  ],
  areaOfNeed: [
    {
      name: "Math",
      owner: {
        connect: {
          email: env.AUTH0_USERNAME,
        },
      },
    },
    {
      name: "Reading",
      owner: {
        connect: {
          email: env.AUTH0_USERNAME,
        },
      },
    },
    {
      name: "Writing",
      owner: {
        connect: {
          email: env.AUTH0_USERNAME,
        },
      },
    },
    {
      name: "Science",
      owner: {
        connect: {
          email: env.AUTH0_USERNAME,
        },
      },
    },
  ],
  family: [
    {
      familyName: "Jugdish",
      balance: 0,
      notes: "Test Family 1",
      owner: {
        connect: {
          email: env.AUTH0_USERNAME,
        },
      },
      parents: {
        create: [
          {
            isPrimary: true,
            firstName: "Ramesh",
            lastName: "Jugdish",
            email: "",
            phone: "555-555-5555",
            ownerId: env.AUTH0_USERNAME,
          },
          {
            isPrimary: false,
            firstName: "Ramoosh",
            lastName: "Jugdish",
            email: "",
            phone: "555-555-5555",
            ownerId: env.AUTH0_USERNAME,
          },
        ],
      },
    },
  ],
} as const;

export const POST = async (request: any) => {
  const bearerToken = request.headers.get("authorization");
  if (bearerToken !== env.CYPRESS_API_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (process.env.AUTH0_USERNAME === undefined || process.env.AUTH0_PASSWORD === undefined) {
    return new Response("Missing AUTH0_USERNAME or AUTH0_PASSWORD", { status: 500 });
  }

  await clearAllSeedData();

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

  for (const entityType of Object.keys(mockData)) {
    // @ts-ignore
    for (const entity of mockData[entityType]) {
      // @ts-ignore
      const existingEntity = await prisma[entityType].findFirst({
        where: {
          ...prisma[entity],
          ownerId: testUser.email,
        },
      });

      if (!existingEntity) {
        // @ts-ignore
        await prisma[entityType].create({
          // @ts-ignore
          data: {
            owner: {
              connect: {
                email: testUser.email,
              },
            },
            ...entity,
          },
        });
      }
    }
  }
  return Response.json({ success: true });
};
