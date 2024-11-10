"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@nextui-org/react";
import { toast } from "react-toastify";
import { Invoice } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import ConfirmationModal from "@/app/components/confirmation_modal";
import FamilyForm, { FamilyFormData, RawFamilyFormData } from "@/app/components/family_page/family_form";
import InvoiceStatusBadge from "@/app/components/invoice_status_badge";
import LoadingPane from "@/app/components/loading_pane";
import { FamilyWithRelations } from "@/types";

interface IFamilyPageProps {
  updateOrCreateFamily: (formData: FamilyFormData, familyId?: string) => Promise<{ success: boolean }>;
  deleteFamily?: (familyId: string) => Promise<{ success: boolean }>;
  family?: FamilyWithRelations;
  presetFamilyName?: string | undefined;
  noRedirect?: boolean;
  onCreate?: () => void;
}

export default function FamilyPage(props: IFamilyPageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hasAssociatedStudents = useMemo(
    () => props.family?.students && props.family?.students?.length > 0,
    [props.family],
  );

  const onSubmit = useCallback(
    async (formData: RawFamilyFormData) => {
      try {
        setIsLoading(true);
        formData.parent1Id = props.family?.parents.find((p) => p.isPrimary)?.id;
        formData.parent2Id = props.family?.parents.find((p) => !p.isPrimary)?.id;
        const res = await props.updateOrCreateFamily(formData as FamilyFormData, props.family?.id);
        setIsLoading(false);
        if (res.success) {
          toast.success(`Family ${props.family?.id ? "updated" : "created"}`);
          if (!props.noRedirect && !props.family?.id) {
            router.push("/app/families");
          }
          router.refresh();
          if (props.onCreate) {
            props.onCreate();
          }
        } else {
          throw new Error("Server error");
        }
      } catch {
        setIsLoading(false);
        toast.error(`Error ${props.family?.id ? "updating" : "creating"} family`);
      }
    },
    [props, router],
  );

  const handleDeleteFamily = useCallback(async () => {
    setIsLoading(true);
    try {
      if (props.deleteFamily && props.family) {
        setIsLoading(true);
        const res = await props.deleteFamily(props.family.id);
        if (!res.success) {
          throw new Error("Server error");
        }
        setShowDeleteModal(false);
        setIsLoading(false);
        router.push("/app/families");
      } else {
        throw new Error("Client error");
      }
    } catch {
      setIsLoading(false);
      toast.error("Failed to delete family");
    }
  }, [props, router]);

  return (
    <>
      {isLoading && <LoadingPane />}
      {props.family && (
        <div className="my-5 mb-5">
          <h2>Finance</h2>
          <div className="mt-1 space-y-8 sm:space-y-0" key="associated-students">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <label htmlFor="balance" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Current balance
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex sm:max-w-md">${Number(props.family.balance).toFixed(2)}</div>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <label htmlFor="invoices" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                invoices
              </label>
              <div className="mt-2">
                <div className="flex w-full">
                  {props.family?.invoices.length === 0 ? (
                    <div className="italic">No past invoices</div>
                  ) : (
                    <div>
                      {props.family?.invoices.map((invoice: Invoice) => (
                        <div className="flex justify-between" key={invoice.id}>
                          <Link href={`/app/invoices/${invoice.id}`}>{invoice.createdAt.toDateString()}</Link>
                          <InvoiceStatusBadge status={invoice.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <Link href={`/app/invoices/create/${props.family.id}`}>
              <Button text="Create invoice" flavor="primary" />
            </Link>
          </div>
        </div>
      )}
      {props.family && (
        <div className="my-5 mb-5">
          <h2>Students</h2>
          <div className="mt-1 space-y-8 sm:space-y-0" key="associated-students">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex flex-col sm:max-w-md" key="associated-students">
                  {props.family?.students.map((student) => (
                    <Link href={`/app/students/${student.id}`} key={student.id}>
                      <span data-testid={`family-student-${student.id}`}>
                        {student.firstName} {student.lastName}
                      </span>
                    </Link>
                  ))}
                  {props.family?.students.length === 0 && (
                    <p className="italic">No students associated with this family</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-5">
        <div className="flex items-center gap-3">
          <h2>Family Profile</h2>
          <h5 className="cursor-pointer text-blue-400" onClick={() => setShowFamilyForm((p) => !p)}>
            {showFamilyForm ? "Hide" : "Show"}
          </h5>
        </div>
        <div className={cn({ visible: showFamilyForm, invisible: !showFamilyForm })}>
          <FamilyForm onSubmit={onSubmit} family={props.family} />
        </div>
      </div>
      <ConfirmationModal
        open={showDeleteModal}
        message="Are you sure you want to delete? This cannot be undone."
        onAccept={handleDeleteFamily}
        onDeny={() => setShowDeleteModal(false)}
      />
      {props.family && props.deleteFamily && (
        <div
          className={cn({ "tooltip tooltip-right": hasAssociatedStudents })}
          data-tip="Cannot delete a family with associated students"
        >
          <Button
            text="Delete family"
            flavor="danger"
            dataTestId="delete-family"
            disabled={hasAssociatedStudents}
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      )}
    </>
  );
}
