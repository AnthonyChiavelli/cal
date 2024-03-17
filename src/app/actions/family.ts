"use server";

import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function updateOrCreateFamily(formData: FormData, familyId?: string): Promise<{ success: boolean }> {
  const { user } = await getSessionOrFail();

  if (familyId) {
    await prisma.family.update({
      where: {
        id: familyId,
      },
      data: {
        familyName: formData.get("familyName") as string,
        balance: 0,
        notes: formData.get("notes") as string,
        ownerId: user.email,
        parents: {
          create: [
            {
              isPrimary: true,
              firstName: formData.get("parent1FirstName") as string,
              lastName: formData.get("parent1LastName") as string,
              email: formData.get("parent1Email") as string,
              phone: formData.get("parent1Phone") as string,
              ownerId: user.email,
            },
            // {
            //   firstName: formData.get('parent2FirstName') as string,
            //   lastName: formData.get('parent2LastName') as string,
            //   email: formData.get('parent2Email') as string,
            //   phone: formData.get('parent2Phone') as string,
            // },
          ],
        },
      },
    });
  } else {
    await prisma.family.create({
      data: {
        familyName: formData.get("familyName") as string,
        balance: 0,
        notes: formData.get("notes") as string,
        ownerId: user.email,
        parents: {
          create: [
            {
              isPrimary: true,
              firstName: formData.get("parent1FirstName") as string,
              lastName: formData.get("parent1LastName") as string,
              email: formData.get("parent1Email") as string,
              phone: formData.get("parent1Phone") as string,
              ownerId: user.email,
            },
            // {
            //   firstName: formData.get('parent2FirstName') as string,
            //   lastName: formData.get('parent2LastName') as string,
            //   email: formData.get('parent2Email') as string,
            //   phone: formData.get('parent2Phone') as string,
            // },
          ],
        },
      },
    });
  }

  return {
    success: true,
  };
}
