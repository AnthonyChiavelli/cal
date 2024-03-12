"use client";

import { useCallback, useState } from "react";
import { Input, Switch } from "@nextui-org/react";
import { toast } from "react-toastify";
import { UserSettings } from "@prisma/client";
import InfoPopover from "@/app/components/info_popover";
import LoadingPane from "./loading_pane";

interface ISettingsFormProps {
  updateUserSettings: (formData: FormData) => Promise<{ success: boolean } | undefined>;
  userSettings: UserSettings;
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
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center justify-between">
            Base pricing
            <InfoPopover text="The default amount to charge 1 student for a session" />
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
            <Input defaultValue={String(props.userSettings.basePrice)} type="number" min="0" name="basePrice" />
          </dd>
          <dt className="text-sm font-medium leading-6 text-gray-900 flex flex-row gap-3 items-center justify-between">
            Show mini day-view calendar
            <InfoPopover text="Show a mini day-view calendar at the bottom of the page when a day is selected in the month view on mobile display, rather than navigating to the day-view calendar page" />
          </dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex items-center">
            <Switch
              defaultSelected={props.userSettings.showInlineDayCalendarInMobileView}
              name="showInlineDayCalendarInMobileView"
            />
          </dd>
        </div>
      </dl>
      <button type="submit" className="mt-6 bg-blue-500 text-white rounded-lg px-4 py-2">
        Save
      </button>
    </form>
  );
}
