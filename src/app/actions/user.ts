import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function updateUserSettings(formData: FormData): Promise<{ success: boolean } | undefined> {
  "use server";

  // TODO this in all server actions
  const { user } = await getSessionOrFail();

  const basePrice = formData.get("basePrice");
  const showInlineDayCalendarInMobileView = formData.get("showInlineDayCalendarInMobileView");

  const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });
  const update = {
    basePrice: Number(basePrice),
    showInlineDayCalendarInMobileView,
  };
  if (userSettings) {
    await prisma.userSettings.update({
      where: { userEmail: userSettings.userEmail },
      data: update,
    });
    return {
      success: true,
    };
  } else {
    await prisma.userSettings.create({
      data: update,
    });
    return {
      success: true,
    };
  }
}
