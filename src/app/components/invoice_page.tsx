import { Prisma } from "@prisma/client";

interface IInvoicePageProps {
  invoice: Prisma.InvoiceGetPayload<{ include: { family: true } }>;
}

export default function InvoicePage(props: IInvoicePageProps) {
  return <div>page</div>;
}
