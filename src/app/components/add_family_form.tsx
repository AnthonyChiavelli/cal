"use client";
import { toast } from "react-toastify";
import LoadingPane from "./loading_pane";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

interface IAddFamilyFormProps {
  updateOrCreateFamily: (formData: FormData, familyId?: string) => Promise<{ success: boolean }>;
  family?: Prisma.FamilyGetPayload<{
    include: { parents: true };
  }>;
}

export default function FamilyForm(props: IAddFamilyFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      try {
        setIsLoading(true);
        const res = await props.updateOrCreateFamily(formData, props.family?.id);
        setIsLoading(false);
        if (res.success) {
          toast.success(`Family ${props.family?.id ? "updated" : "created"}`);
          router.push("/app/families");
          router.refresh();
        }
      } catch {
        setIsLoading(false);
        toast.success("Server error");
      }
    },
    [props, router],
  );

  return (
    <form className="mt-6 border-t border-gray-100" action={handleSubmit}>
      {isLoading && <LoadingPane />}
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center">Family Name</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <input defaultValue={props.family?.familyName} type="text" name="familyName" />
          </dd>
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center">
            Parent First Name
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <input defaultValue={props.family?.parents[0].firstName} type="text" name="parent1FirstName" />
          </dd>
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center">
            Parent Last Name
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <input defaultValue={props.family?.parents[0].lastName} type="text" name="parent1LastName" />
          </dd>
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center">Notes</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <textarea defaultValue={props.family?.notes} name="notes" />
          </dd>
        </div>
      </dl>
      <button type="submit" className="mt-6 bg-blue-500 text-white rounded-lg px-4 py-2">
        Save
      </button>
    </form>
  );
}
