"use server";

import prisma from "@/db";
import { getSessionOrFail } from "./util";

interface FamilyFormData {
  familyName: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent1Phone: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  parent2Phone?: string;
  notes?: string;
}

export async function updateOrCreateFamily(formData: FamilyFormData, familyId?: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();

  // TODO action record

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
      },
      data: {
        familyName: formData.familyName,
        notes: formData.notes || "",
        parents: {
          deleteMany: {},
          create: parentsQuery,
        },
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
