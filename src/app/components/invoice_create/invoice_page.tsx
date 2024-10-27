"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "../button";
import { Family } from "@prisma/client";
import { useRouter } from "next/navigation";

export interface CreateInterfaceFormData {
  familyId: string;
  amount: Number;
}

interface IInvoicePageProps {
  family?: Family | null;
  onSubmit: (formData: CreateInterfaceFormData) => Promise<{ success: boolean; invoiceId?: string }>;
}

export default function InvoicePage(props: IInvoicePageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const familyBalance = useMemo(() => props.family?.balance, [props.family]);

  const handleApplyFullBalance = useCallback(() => {
    setValue("amount", familyBalance);
  }, [familyBalance, setValue]);

  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        const response = await props.onSubmit({ ...formData, familyId: props.family?.id });
        if (!response.success) {
          throw new Error();
        }
        toast.success("Invoice created");
        if (response.invoiceId) {
          router.push(`/app/invoices/${response.invoiceId}`);
        }
      } catch (e) {
        toast.success("Invoice creation error");
      }
    },
    [props, router],
  );

  return (
    <div>
      <h1>Create Invoice</h1>
      <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                  <input
                    aria-labelledby={"familyName"}
                    required
                    data-cy={`input-${"familyName"}`}
                    data-testid={`input-${"familyName"}`}
                    className={cn("input w-full", {
                      "input-error": errors["familyName"],
                    })}
                    {...register("familyName", { required: true })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {familyBalance && (
          <div className="mt-1 space-y-8 sm:space-y-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Family Balance*
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex sm:max-w-md">{Number(familyBalance).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Invoice Amount
            </label>
            <div className="mt-2 flex flex-row gap-3 sm:col-span-2 sm:mt-0">
              <div className="flex sm:max-w-md">
                <label className="input input-bordered flex w-full items-center gap-2">
                  <span>$</span>
                  <input
                    aria-labelledby={"amount"}
                    required
                    type="number"
                    data-cy={`input-${"amount"}`}
                    data-testid={`input-${"amount"}`}
                    className={cn({
                      "input-error": errors["amount"],
                    })}
                    {...register("amount", { required: true })}
                  />
                </label>
              </div>
              <Button text="Apply full balance" flavor="primary" onClick={handleApplyFullBalance} />
            </div>
          </div>
        </div>
        <Button type="submit" flavor="primary" text="Create" />
      </form>
    </div>
  );
}
