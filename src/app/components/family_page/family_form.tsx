"use client";

import { useEffect, useMemo } from "react";
import { cn } from "@nextui-org/react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@/app/components/button";
import PhoneInput from "@/app/components/phone_input";
import { FamilyWithRelations } from "@/types";

interface IFamilyFormProps {
  family?: FamilyWithRelations;
  onSubmit: (data: RawFamilyFormData) => void;
}

// ReactHookForm calls onsubmit with this type
export interface RawFamilyFormData {
  familyName?: string;
  parent1FirstName?: string;
  parent1LastName?: string;
  parent1Phone?: string | null;
  parent2FirstName?: string | null;
  parent2LastName?: string | null;
  parent2Phone?: string | null;
  notes?: string | null;
}

export interface FamilyFormData {
  familyName: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent1Phone: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  parent2Phone?: string;
  notes?: string;
}

export default function FamilyForm(props: IFamilyFormProps) {
  const initialValues = useMemo(() => {
    return {
      familyName: props.family?.familyName,
      parent1FirstName: props.family?.parents[0].firstName,
      parent1LastName: props.family?.parents[0].lastName,
      parent1Phone: props.family?.parents[0].phone,
      parent2FirstName: props.family?.parents[1]?.firstName,
      parent2LastName: props.family?.parents[1]?.lastName,
      parent2Phone: props.family?.parents[1]?.phone,
      notes: props.family?.notes,
    };
  }, [props.family]);
  const {
    register,
    handleSubmit,
    getFieldState,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: initialValues });

  const familyName = useWatch({ control, name: "familyName" });

  useEffect(() => {
    if (props.family) {
      return;
    }
    if (!getFieldState("parent1LastName").isDirty) {
      setValue("parent1LastName", familyName);
    }
    if (!getFieldState("parent2LastName").isDirty) {
      setValue("parent2LastName", familyName);
    }
  }, [setValue, familyName, getFieldState, props.family]);

  return (
    <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleSubmit(props.onSubmit)}>
      <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Family Name*
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
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
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 1 First Name*
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              <input
                aria-labelledby={"parent1FirstName"}
                data-cy={`input-${"parent1FirstName"}`}
                data-testid={`input-${"parent1FirstName"}`}
                className={cn("input w-full", {
                  "input-error": errors["parent1FirstName"],
                })}
                {...register("parent1FirstName", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 1 Last Name*
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              <input
                aria-labelledby={"parent1LastName"}
                data-cy={`input-${"parent1LastName"}`}
                data-testid={`input-${"parent1LastName"}`}
                className={cn("input w-full", {
                  "input-error": errors["parent1LastName"],
                })}
                {...register("parent1LastName", { required: true })}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 1 Phone
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              {/* @ts-ignore */}
              <PhoneInput control={control} name={"parent1Phone"} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 2 First Name
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              <input
                aria-labelledby={"parent2FirstName"}
                data-cy={`input-${"parent2FirstName"}`}
                data-testid={`input-${"parent2FirstName"}`}
                className={cn("input w-full", {
                  "input-error": errors["parent2FirstName"],
                })}
                {...register("parent2FirstName")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 2 Last Name
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              <input
                aria-labelledby={"parent2LastName"}
                data-cy={`input-${"parent2LastName"}`}
                data-testid={`input-${"parent2LastName"}`}
                className={cn("input w-full", {
                  "input-error": errors["parent2LastName"],
                })}
                {...register("parent2LastName")}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Parent 2 Phone
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              {/* @ts-ignore */}
              <PhoneInput control={control} name={"parent2Phone"} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            Notes
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex sm:max-w-md">
              <textarea
                aria-labelledby={"notes"}
                data-testid={`textarea-notes`}
                data-cy={`textarea-notes`}
                className={cn("textarea w-full", {
                  "textarea-error": errors["notes"],
                })}
                {...register("notes")}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button
          role="submit"
          dataCy="submit-form"
          disabled={!isDirty}
          flavor="primary"
          text={props.family ? "Update" : "Add"}
          type="submit"
        />
      </div>
    </form>
  );
}
