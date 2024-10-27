import { createInvoice } from "@/app/actions/invoice";
import InvoiceCreatePage from "@/app/components/invoice_create/invoice_create_page";
import { getFamily } from "@/app/methods/family";

interface ICreateInvoiceProps {
  params: {
    familyId: string;
  };
}

export default async function CreateInvoice(props: ICreateInvoiceProps) {
  const family = await getFamily(props.params.familyId);
  return <InvoiceCreatePage family={family} onSubmit={createInvoice} />;
}
