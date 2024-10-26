"use server";

import { ActionType } from "@prisma/client";
import { FamilyFormData } from "@/app/components/family_page/family_form";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function updateOrCreateFamily(formData: FamilyFormData, familyId?: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();

  const parentsQuery = [
    {
      isPrimary: true,
      firstName: formData.parent1FirstName,
      lastName: formData.parent1LastName,
      email: "",
      phone: formData.parent1Phone,
      ownerId: user.email,
    },
  ];
  if (formData.parent2FirstName && formData.parent2LastName && formData.parent2Phone) {
    parentsQuery.push({
      isPrimary: false,
      firstName: formData.parent2FirstName,
      lastName: formData.parent2LastName,
      email: "",
      phone: formData.parent2Phone,
      ownerId: user.email,
    });
  }
  if (familyId) {
    await prisma.family.update({
      where: {
        id: familyId,
        ownerId: user.email,
      },
      data: {
        familyName: formData.familyName,
        notes: formData.notes || "",
        parents: {
          // TODO update parents instead of creating new ones
          create: parentsQuery,
          // update: {},
        },
      },
    });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.UPDATE_FAMILY,
        additionalData: {
          familyId,
          familyObj: JSON.stringify({ ...formData }),
        },
        ownerId: user.email,
      },
    });
  } else {
    await prisma.family.create({
      data: {
        familyName: formData.familyName,
        balance: 0,
        notes: formData.notes || "",
        owner: {
          connect: {
            email: user.email,
          },
        },
        parents: {
          create: parentsQuery,
        },
      },
    });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_FAMILY,
        additionalData: {
          familyObj: JSON.stringify(formData),
        },
        ownerId: user.email,
      },
    });
  }

  return {
    success: true,
  };
}

export async function deleteFamily(familyId: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();
  const family = await prisma.family.findUnique({
    where: {
      id: familyId,
      ownerId: user.email,
    },
    include: {
      students: true,
    },
  });

  if (!family) {
    throw new Error("Family not found");
  }
  if (family.students.length > 0) {
    throw new Error("Family has students");
  }

  await prisma.family.delete({
    where: {
      id: familyId,
      ownerId: user.email,
    },
  });
  return {
    success: true,
  };
}
