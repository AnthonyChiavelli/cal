"use client";

import React from "react";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import DataTable from "@/app/components/data_table";
import EntitySearch from "./entity_search";
import Pager from "./pager";

interface IInvoiceTableProps {
  invoices: Prisma.InvoiceGetPayload<{ include: { family: true } }>[];
  invoiceCount: number;
}

export default function InvoiceTable(props: IInvoiceTableProps) {
  const router = useRouter();
  return (
    <div>
      <h1>Invoices</h1>
      <section className="mt-5">
        <EntitySearch placeHolder="Search invoices" />
      </section>
      <section className="mt-5">
        <DataTable columns={["Family Name", "Original Balance", "Current Balance", "Paid", "Date"]}>
          {props.invoices.map((invoice) => ({
            rowProps: {
              className: "cursor-pointer hover:bg-sky-100",
            },
            rowLink: `/app/invoices/${invoice.id}`,
            rowKey: invoice.id,
            cells: [
              invoice.family.familyName,
              invoice.amount.toString(),
              new Prisma.Decimal(invoice.amount).minus(new Prisma.Decimal(invoice.paidAmount)).toString(),
              invoice.paid ? "Y" : "N",
              invoice.createdAt.toDateString(),
            ],
          }))}
        </DataTable>
      </section>
      <section className="mt-5">
        <Pager totalCount={props.invoiceCount} pageSize={10} />
      </section>
    </div>
  );
}
