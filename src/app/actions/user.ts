import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { prisma } from "@/db";

export async function updateUserSettings(formData: FormData): Promise<{ success: boolean } | undefined> {
  "use server";

  const basePrice = formData.get("basePrice");
  if (basePrice) {
    const session = await getSession();
    if (!session) {
      return redirect("/app");
    }
    const user = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (!user) {
      return redirect("/app");
    }

    const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });
    if (userSettings) {
      await prisma.userSettings.update({
        where: { userEmail: userSettings.userEmail },
        data: { basePrice: Number(basePrice) },
      });
      return {
        success: true,
      };
    } else {
      await prisma.userSettings.create({
        data: {
          basePrice: Number(basePrice),
          userEmail: user.email,
        },
      });
      return {
        success: true,
      };
    }
  }
}
