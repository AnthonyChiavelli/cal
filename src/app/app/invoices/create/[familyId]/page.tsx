import { createInvoice } from "@/app/actions/invoice";
import InvoicePage from "@/app/components/invoice_create/invoice_page";
import { getFamily } from "@/app/methods/family";

interface ICreateInvoiceProps {
  params: {
    familyId: string;
  };
}

export default async function CreateInvoice(props: ICreateInvoiceProps) {
  const family = await getFamily(props.params.familyId);
  return <InvoicePage family={family} onSubmit={createInvoice} />;
}
