"use server";

import { Prisma } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions/util";
import prisma from "@/db";

export async function updateUserSettings(formData: FormData): Promise<{ success: boolean } | undefined> {
  const { user } = await getSessionOrFail();

  const basePrice = formData.get("basePrice");
  const showInlineDayCalendarInMobileView = formData.has("showInlineDayCalendarInMobileView");
  const clientInvoiceTemplate = formData.get("clientInvoiceTemplate");

  const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });
  if (userSettings) {
    const update: Prisma.UserSettingsUpdateInput = {
      basePrice: Number(basePrice),
      showInlineDayCalendarInMobileView: showInlineDayCalendarInMobileView,
      clientInvoiceTemplate: clientInvoiceTemplate ? String(clientInvoiceTemplate) : "",
    };
    await prisma.userSettings.update({
      where: { userEmail: userSettings.userEmail },
      data: update,
    });
    return {
      success: true,
    };
  } else {
    const update: Prisma.UserSettingsCreateInput = {
      basePrice: Number(basePrice),
      showInlineDayCalendarInMobileView: showInlineDayCalendarInMobileView,
      clientInvoiceTemplate: clientInvoiceTemplate ? String(clientInvoiceTemplate) : "",
    };
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
