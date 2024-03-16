"use server";

import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function updateUserSettings(formData: FormData): Promise<{ success: boolean } | undefined> {
  const { user } = await getSessionOrFail();

  const basePrice = formData.get("basePrice");
  const showInlineDayCalendarInMobileView = formData.has("showInlineDayCalendarInMobileView");

  const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });
  const update = {
    basePrice: Number(basePrice),
    showInlineDayCalendarInMobileView: showInlineDayCalendarInMobileView,
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

export async function getUserSettings() {
  const { user } = await getSessionOrFail();
  return await prisma.userSettings.upsert({
    where: { userEmail: user.email },
    update: {},
    create: {
      userEmail: user.email,
      basePrice: 125,
      showInlineDayCalendarInMobileView: false,
    },
  });
}
