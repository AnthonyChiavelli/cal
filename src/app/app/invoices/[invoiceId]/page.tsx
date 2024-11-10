import { getUserSettings } from "@/app/actions";
import { updateInvoiceStatus } from "@/app/actions/invoice";
import InvoicePage from "@/app/components/invoice_page";
import ResourceNotFound from "@/app/components/resource_not_found";
import { getInvoice } from "@/app/methods/invoice";

interface ICreateInvoiceProps {
  params: {
    invoiceId: string;
  };
}

export default async function CreateInvoice(props: ICreateInvoiceProps) {
  const invoice = await getInvoice(Number(props.params.invoiceId));
  const userSettings = await getUserSettings();
  if (!invoice) {
    return <ResourceNotFound resourceName="Invoice" />;
  }
  return (
    <InvoicePage
      invoice={invoice}
      invoiceTemplate={userSettings.clientInvoiceTemplate}
      onChangeStatus={updateInvoiceStatus}
    />
  );
}
