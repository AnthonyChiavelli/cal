import { createInvoice } from "@/app/actions/invoice";
import InvoiceCreatePage from "@/app/components/invoice_create/invoice_create_page";
import { getUninvoicedEvents } from "@/app/methods/event";
import { getFamily } from "@/app/methods/family";

interface ICreateInvoiceProps {
  params: {
    familyId: string;
  };
}

export default async function CreateInvoice(props: ICreateInvoiceProps) {
  const family = await getFamily(props.params.familyId);
  // TODO filter by family
  const uninvoicedEvents = await getUninvoicedEvents();
  return <InvoiceCreatePage family={family} onSubmit={createInvoice} uninvoicedEvents={uninvoicedEvents} />;
}
