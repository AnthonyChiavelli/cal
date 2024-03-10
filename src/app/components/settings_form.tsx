"use client";
import { toast } from "react-toastify";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import LoadingPane from "./loading_pane";
import { useCallback, useState } from "react";

interface ISettingsFormProps {
  updateUserSettings: (formData: FormData) => Promise<{ success: boolean } | undefined>;
  basePricing: number;
}

export default function SettingsForm(props: ISettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      try {
        setIsLoading(true);
        const res = await props.updateUserSettings(formData);
        setIsLoading(false);
        if (res?.success) {
          toast.success("Settings updated");
        }
      } catch {
        toast.success("Error updating setting");
      }
    },
    [props],
  );

  return (
    <form className="mt-6 border-t border-gray-100" action={handleSubmit}>
      {isLoading && <LoadingPane />}
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center">
            Base pricing
            <Popover>
              <PopoverTrigger>
                <QuestionMarkCircleIcon width={20} height={20} />
              </PopoverTrigger>
              <PopoverContent className="text-gray-900">
                <div>The default amount to charge 1 student for a session</div>
              </PopoverContent>
            </Popover>
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <input defaultValue={Number(props.basePricing)} type="number" min="0" name="basePrice" />
          </dd>
        </div>
      </dl>
      <button type="submit" className="mt-6 bg-blue-500 text-white rounded-lg px-4 py-2">
        Save
      </button>
    </form>
  );
}
