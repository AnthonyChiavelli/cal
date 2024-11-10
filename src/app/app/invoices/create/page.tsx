import { createInvoice } from "@/app/actions/invoice";
import InvoiceCreatePage from "@/app/components/invoice_create/invoice_create_page";
import { getUninvoicedEvents } from "@/app/methods/event";
import { getFamilies } from "@/app/methods/family";

export default async function CreateInvoice() {
  const families = await getFamilies({});
  const uninvoicedEvents = await getUninvoicedEvents();
  return <InvoiceCreatePage onSubmit={createInvoice} families={families} uninvoicedEvents={uninvoicedEvents} />;
}
