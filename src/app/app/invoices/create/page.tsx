import { createInvoice } from "@/app/actions/invoice";
import InvoicePage from "@/app/components/invoice_create/invoice_page";

export default function CreateInvoice() {
  return <InvoicePage onSubmit={createInvoice} />;
}
