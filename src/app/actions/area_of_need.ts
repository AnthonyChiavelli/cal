"use server";

import { ActionType } from "@prisma/client";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function updateOrCreateAreaOfNeed(name: string, areaOfNeedId?: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();
  if (areaOfNeedId) {
    throw new Error("Not implemented");
  } else {
    const existingAreaOfNeed = await prisma.areaOfNeed.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        ownerId: user.email,
      },
    });

    if (existingAreaOfNeed) {
      throw new Error("Area of need with this name already exists");
    }

    await prisma.areaOfNeed.create({
      data: {
        name,
        owner: {
          connect: {
            email: user.email,
          },
        },
      },
    });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_AREA_OF_NEED,
        additionalData: {
          areaOfNeedObj: JSON.stringify({
            name,
            owner: {
              connect: {
                email: user.email,
              },
            },
          }),
        },
        ownerId: user.email,
      },
    });
  }
  return { success: true };
}

export async function deleteAreaOfNeed(areaOfNeedId: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();

  const areaOfNeed = await prisma.areaOfNeed.findFirst({
    where: {
      id: areaOfNeedId,
      ownerId: user.email,
    },
  });
  if (!areaOfNeed) {
    throw new Error("Area of need not found");
  }

  const result = await prisma.areaOfNeed.delete({
    where: {
      id: areaOfNeedId,
      ownerId: user.email,
    },
  });

  if (!result) {
    throw new Error("Failed to delete area of need");
  }

  await prisma.actionRecord.create({
    data: {
      actionType: ActionType.DELETE_AREA_OF_NEED,
      additionalData: {
        areaOfNeedObj: JSON.stringify({
          ...areaOfNeed,
          owner: {
            connect: {
              email: user.email,
            },
          },
        }),
      },
      ownerId: user.email,
    },
  });

  return { success: true };
}
