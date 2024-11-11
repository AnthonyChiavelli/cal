import { InvoiceStatus, Prisma } from "@prisma/client";

export function renderClientInvoiceTemplate(
  templateString: string,
  invoice: Prisma.InvoiceGetPayload<{ include: { family: { include: { parents: true; students: true } } } }>,
) {
  const replacements = [
    { tag: "{familyName}", value: invoice.family.familyName },
    { tag: "{invoiceAmount}", value: `$${new Prisma.Decimal(invoice.amount).toFixed(2)}` },
    { tag: "{parent1FirstName}", value: invoice.family.parents.find((p) => p.isPrimary)?.firstName || "(unknown" },
    { tag: "{parent1LastName}", value: invoice.family.parents.find((p) => p.isPrimary)?.lastName || "(unknown" },
    { tag: "{parent2FirstName}", value: invoice.family.parents.find((p) => !p.isPrimary)?.firstName || "(unknown" },
    { tag: "{parent2LastName}", value: invoice.family.parents.find((p) => !p.isPrimary)?.lastName || "(unknown" },
    { tag: "{totalBalance}", value: `$${new Prisma.Decimal(invoice.family.balance).toFixed(2)}` },
  ];

  for (const r of replacements) {
    templateString = templateString.replaceAll(r.tag, r.value);
  }
  return templateString;
}

// TODO test
export function getInvoiceTotal(invoice: Prisma.InvoiceGetPayload<{ include: { eventStudents: true } }>): number {
  const eventClassTotal = invoice.eventStudents.reduce((m, event) => Number(event.cost) + m, 0);
  return eventClassTotal;
}

export function validNextStatuses(currentStatus: InvoiceStatus): InvoiceStatus[] {
  switch (currentStatus) {
    case InvoiceStatus.CREATED:
      return [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.CLOSED];
    case InvoiceStatus.SENT:
      return [InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.CLOSED];
    case InvoiceStatus.PARTIALLY_PAID:
      return [InvoiceStatus.CLOSED];
    case InvoiceStatus.CLOSED:
      return [];
  }
}
