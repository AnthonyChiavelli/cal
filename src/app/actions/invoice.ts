"use server";

import { ActionType, InvoiceStatus } from "@prisma/client";
import { getSessionOrFail } from "@/app/actions/util";
import { CreateInvoiceFormData } from "@/app/components/invoice_create/invoice_create_page";
import prisma from "@/db";
import { validNextStatuses } from "@/util/invoice";

export async function createInvoice(
  formData: CreateInvoiceFormData,
): Promise<{ success: boolean; invoiceId?: number }> {
  const { user } = await getSessionOrFail();

  try {
    const result = await prisma.invoice.create({
      data: {
        family: {
          connect: { id: formData.familyId },
        },
        owner: { connect: { email: user.email } },
        eventStudents: {
          connect: formData.eventStudentIds.map((esd) => ({ id: esd })),
        },
        customPriceModifier: 0,
        paidAmount: 0,
        sent: false,
        paid: false,
        // TODO remove
        amount: 0,
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
      invoiceId: Number(result.id),
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
    throw e;
  }
}

export async function updateInvoiceStatus(invoiceId: number, newStatus: InvoiceStatus) {
  const { user } = await getSessionOrFail();

  const invoice = await prisma.invoice.findFirstOrThrow({
    where: { id: { equals: invoiceId }, ownerId: { equals: user.email } },
  });
  if (!validNextStatuses(invoice.status).includes(newStatus)) {
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.UPDATE_INVOICE,
        success: false,
        owner: {
          connect: { email: user.email },
        },
        additionalData: {
          invoiceId,
          newStatus,
          details: "Cannot transition to this status",
        },
      },
    });
    throw new Error("Cannot transition to this status");
  }

  try {
    await prisma.invoice.update({
      where: {
        ownerId: { equals: user.email },
        id: invoiceId,
      },
      data: {
        status: newStatus,
      },
    });
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.UPDATE_INVOICE,
        success: true,
        owner: {
          connect: { email: user.email },
        },
        additionalData: {
          invoiceId,
          newStatus,
        },
      },
    });
  } catch {
    await prisma.actionRecord.create({
      data: {
        actionType: ActionType.UPDATE_INVOICE,
        success: false,
        owner: {
          connect: { email: user.email },
        },
        additionalData: {
          invoiceId,
          newStatus,
        },
      },
    });
  }
}
