"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import { Family } from "@prisma/client";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import { promptModal } from "@/app/components/comfirmation_promise_modal";
import EventChargesList from "@/app/components/event_charges_list";
import { EventStudentWithRelations } from "@/types";
import { pluralize } from "@/util/string";

export interface CreateInvoiceFormData {
  familyId: string;
  amount: Number;
  eventStudentIds: string[];
  customAmount: Number;
}

interface IInvoicePageProps {
  family?: Family | null;
  families?: Family[];
  onSubmit: (formData: CreateInvoiceFormData) => Promise<{ success: boolean; invoiceId?: number }>;
  uninvoicedEvents?: EventStudentWithRelations[];
}

// TODO test
export default function InvoiceCreatePage(props: IInvoicePageProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const watchFamilyInput = watch("family");
  const watchCustomAmount = watch("customAmount");

  const [addedEvents, setAddedEvents] = useState<EventStudentWithRelations[]>([]);

  const uninvoicedEvents = useMemo((): EventStudentWithRelations[] => {
    const familyId = props.family?.id || props.families?.find((f) => f.id === watchFamilyInput?.value)?.id;
    if (familyId) {
      return props.uninvoicedEvents?.filter((event) => event.student.family?.id === familyId) || [];
    } else {
      return [];
    }
  }, [props.families, props.family?.id, props.uninvoicedEvents, watchFamilyInput?.value]);

  const familySelected = useMemo(() => props.family || watchFamilyInput?.value, [props, watchFamilyInput]);

  const handleAddAllEvents = useCallback(() => {
    if (uninvoicedEvents) {
      setAddedEvents(uninvoicedEvents);
    }
  }, [setAddedEvents, uninvoicedEvents]);

  const handleToggleEvent = useCallback(
    (event: EventStudentWithRelations) => {
      if (addedEvents.find((ae) => ae.id === event.id)) {
        setAddedEvents(addedEvents.filter((e) => e.id !== event.id));
      } else {
        setAddedEvents([...addedEvents, event]);
      }
    },
    [addedEvents],
  );

  const currentTotal = useMemo(() => {
    return (
      addedEvents.reduce((m, event) => Number(event.cost) + m, 0) + (watchCustomAmount ? Number(watchCustomAmount) : 0)
    );
  }, [addedEvents, watchCustomAmount]);

  const onHandleSubmit = useCallback(
    async (formData: any) => {
      const accept = await promptModal(
        `Create an invoice with charges from ${pluralize("class", addedEvents.length, true, "classes")}?`,
      );
      if (!accept) {
        return;
      }
      try {
        const familyId = props.family?.id || formData.family.value;
        const eventStudentIds = addedEvents.map((e) => e.id);
        const response = await props.onSubmit({
          ...formData,
          eventStudentIds,
          customAmount: watchCustomAmount,
          familyId,
        });
        if (!response.success) {
          throw new Error();
        }
        toast.success("Invoice created");
        if (response.invoiceId) {
          router.push(`/app/invoices/${response.invoiceId}`);
        }
      } catch (e) {
        toast.error("Invoice creation error");
      }
    },
    [props, router, watchCustomAmount, addedEvents],
  );

  return (
    <div>
      <h1>Create Invoice</h1>
      <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleSubmit(onHandleSubmit)}>
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Family Name*
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex sm:max-w-md">
                {props.family ? (
                  <div>{props.family.familyName}</div>
                ) : (
                  <>
                    <Controller
                      name={"family"}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CreatableSelect
                          inputId={"family"}
                          className={cn("w-full", {
                            "input-error": errors["family"],
                            [`creatable-${"family"}`]: true,
                          })}
                          isMulti={false}
                          data-testid={`input-${"family"}`}
                          data-cy={`input-${"family"}`}
                          options={props.families?.map((f) => ({ value: f.id, label: f.familyName }))}
                          {...field}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderRadius: ".5rem",
                              borderWidth: "2px",
                              borderColor: errors["family"] ? "#ff8e93" : "rgb(228, 228, 231)",
                              paddingTop: "7px",
                              paddingBottom: "7px",
                            }),
                          }}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {familySelected && (
          <>
            <div className="mt-1 space-y-8 sm:space-y-0">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Outstanding classes
                </label>
                <div className="mt-2">
                  <div className="flex flex-col gap-2">
                    {uninvoicedEvents.length > 0 ? (
                      <div>
                        <EventChargesList
                          eventStudents={uninvoicedEvents}
                          eventStudentsIncludedInInvoice={addedEvents}
                          onToggleEvent={handleToggleEvent}
                        />
                        {uninvoicedEvents?.length === addedEvents?.length ? (
                          <div className="cursor-pointer text-center text-red-400" onClick={() => setAddedEvents([])}>
                            Remove all
                          </div>
                        ) : (
                          <div className="cursor-pointer text-center text-blue-400" onClick={handleAddAllEvents}>
                            Add all to invoice
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm">
                        No unpaid classes. Once classes with this family&apos;s students are marked complete, you will
                        be able to create an invoice
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="mt-1 space-y-8 sm:space-y-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Invoice Amount
                </label>
                <div className="mt-2 flex flex-row gap-3 sm:col-span-2 sm:mt-0">
                  <div className="flex sm:max-w-md">
                    <div>${currentTotal}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* TODO make each one of these things a component */}
            <div className="mt-1 space-y-8 sm:space-y-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                  Notes
                </label>
                <div className="mt-2 flex flex-row gap-3 sm:col-span-2 sm:mt-0">
                  <textarea
                    aria-labelledby={"notes"}
                    data-cy={`input-${"notes"}`}
                    data-testid={`input-${"notes"}`}
                    className={cn("textarea textarea-bordered w-full", {
                      "input-error": errors["notes"],
                    })}
                    {...register("notes", { required: false })}
                  />
                </div>
              </div>
            </div>
            <Button disabled={currentTotal <= 0} type="submit" flavor="primary" text="Create" />
          </>
        )}
      </form>
    </div>
  );
}
