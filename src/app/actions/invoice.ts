"use server";

import { CreateInterfaceFormData } from "../components/invoice_create/invoice_page";
import { ActionType, Prisma } from "@prisma/client";
import prisma from "@/db";
import { getSessionOrFail } from "./util";

export async function createInvoice(
  formData: CreateInterfaceFormData,
): Promise<{ success: boolean; invoiceId?: string }> {
  const { user } = await getSessionOrFail();

  try {
    const result = await prisma.invoice.create({
      data: {
        family: {
          connect: { id: formData.familyId },
        },
        owner: { connect: { email: user.email } },
        paidAmount: 0,
        sent: false,
        paid: false,
        amount: new Prisma.Decimal(formData.amount.toString()),
      },
    });

    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_INVOICE,
        success: true,
        additionalData: { formData: JSON.parse(JSON.stringify(formData)) },
        ownerId: user.email,
      },
    });
    return {
      success: true,
      invoiceId: result.id,
    };
  } catch (e) {
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.CREATE_INVOICE,
        success: false,
        additionalData: { formData: JSON.parse(JSON.stringify(formData)) },
        ownerId: user.email,
      },
    });
    // throw new Error("Error creating invoice");
    throw e
  }
}
