"use client";

import { useCallback, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { promptModal } from "@/app/components/comfirmation_promise_modal";
import InvoiceStatusBadge from "@/app/components/invoice_status_badge";
import Modal from "@/app/components/modal";
import { getInvoiceTotal, renderClientInvoiceTemplate, validNextStatuses } from "@/util/invoice";

interface IInvoicePageProps {
  invoice: Prisma.InvoiceGetPayload<{
    include: { family: { include: { parents: true; students: true } }; eventStudents: true };
  }>;
  invoiceTemplate: string;
  eventStudentsSinceLastInvoice?: Prisma.EventStudentGetPayload<{ include: { event: true; student: true } }>[];
  onChangeStatus: (invoiceId: number, status: InvoiceStatus) => void;
}

export default function InvoicePage(props: IInvoicePageProps) {
  const [showSolicitationModal, setShowSolicitationModal] = useState(false);
  const [solicitationText, setSolicitationText] = useState("");

  const handleGenerateSolicitation = useCallback(() => {
    setSolicitationText(renderClientInvoiceTemplate(props.invoiceTemplate, props.invoice));
    setShowSolicitationModal(true);
  }, [props.invoice, props.invoiceTemplate]);

  const handleChangeStatus = useCallback(
    async (newStatus: InvoiceStatus) => {
      if (await promptModal(`Set this invoice to '${newStatus.toLocaleLowerCase()}'?`)) {
        try {
          props.onChangeStatus(props.invoice.id, newStatus);
          toast.success("Status updated");
        } catch {
          toast.error("Status updated failed");
        }
      }
    },
    [props],
  );

  return (
    <div>
      <h2>Invoice {props.invoice.id}</h2>
      <section className="mt-2 space-y-8 sm:space-y-0" key="associated-students">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">Family</label>
          <div className="mt-2 sm:col-span-2 sm:mt-0 sm:pt-1.5">
            <div className="flex sm:max-w-md">{props.invoice.family.familyName}</div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">Amount</label>
          <div className="mt-2 sm:col-span-2 sm:mt-0 sm:pt-1.5">
            <div className="flex sm:max-w-md">${getInvoiceTotal(props.invoice)}</div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">Status</label>
          <div className="mt-2 sm:col-span-2 sm:mt-0 sm:pt-1.5">
            <div className="flex sm:max-w-md">
              {validNextStatuses(props.invoice.status).length > 0 ? (
                <div className="dropdown">
                  <div tabIndex={0} role="button" className="inline-flex cursor-pointer">
                    <InvoiceStatusBadge status={props.invoice.status} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] w-52 gap-2 rounded-box bg-base-100 p-2 shadow"
                  >
                    {validNextStatuses(props.invoice.status).map((k) => (
                      <InvoiceStatusBadge
                        key={k}
                        className="cursor-pointer"
                        status={k as InvoiceStatus}
                        onClick={() => handleChangeStatus(k)}
                      />
                    ))}
                  </ul>
                </div>
              ) : (
                <InvoiceStatusBadge status={props.invoice.status} />
              )}
            </div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">Class Breakdown</label>
          <div className="mt-2 sm:col-span-2 sm:mt-0 sm:pt-1.5">
            <div className="flex sm:max-w-md">{JSON.stringify(props.eventStudentsSinceLastInvoice)}</div>
          </div>
        </div>
        {props.invoice.status !== InvoiceStatus.CLOSED && (
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">Actions</label>
            <div className="mt-2 flex flex-col gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleGenerateSolicitation}>
                Generate Solicitation
              </button>
              <button className="btn btn-primary btn-sm">Record Payment</button>
            </div>
          </div>
        )}
      </section>

      <Modal open={showSolicitationModal} close={() => setShowSolicitationModal(false)}>
        <div className="flex flex-col gap-3">
          <div>
            <textarea
              className="textarea w-full"
              value={solicitationText}
              onChange={(e) => setSolicitationText(e.target.value)}
            />
          </div>
          <CopyToClipboard text={solicitationText} onCopy={() => toast.success("Copied!")}>
            <button className="btn btn-primary">Copy to clipboard</button>
          </CopyToClipboard>
        </div>
      </Modal>
    </div>
  );
}
