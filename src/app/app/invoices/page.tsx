import React from "react";
import InvoiceTable from "@/app/components/invoice_table";
import { getInvoiceCount, getInvoices } from "@/app/methods/invoice";

export default async function Invoices({
  searchParams,
}: {
  searchParams: { page?: number; search?: string; importComplete: boolean };
}) {
  const invoices = await getInvoices(searchParams);
  const invoiceCount = await getInvoiceCount(searchParams);

  return <InvoiceTable invoices={invoices} invoiceCount={invoiceCount} />;
}
