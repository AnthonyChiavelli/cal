import { createInvoice } from "@/app/actions/invoice";
import InvoiceCreatePage from "@/app/components/invoice_create/invoice_create_page";
import { getFamilies } from "@/app/methods/family";

export default async function CreateInvoice() {
  const families = await getFamilies({});
  return <InvoiceCreatePage onSubmit={createInvoice} families={families} />;
}
