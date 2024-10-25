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
        if (res?.success) {
          toast.success("Settings updated");
        }
      } catch (e) {
        console.error(e);
        toast.error("Error updating settings");
      } finally {
        setIsLoading(false);
      }
    },
    [props],
  );

  return (
    <form className="mt-6 border-t border-gray-100" action={handleSubmit}>
      {isLoading && <LoadingPane />}
      <dl className="divide-y divide-gray-100">
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="flex flex-row items-center justify-between gap-3 text-sm font-medium leading-6 text-gray-900">
            Base pricing
            <InfoPopover text="The default amount to charge 1 student for a session" />
          </dt>
          <dd className="mb-2 mt-1 flex items-center text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <Input defaultValue={String(props.userSettings.basePrice)} type="number" min="0" name="basePrice" />
          </dd>
          <dt className="flex flex-row items-center justify-between gap-3 text-sm font-medium leading-6 text-gray-900">
            Show mini day-view calendar
            <InfoPopover text="Show a mini day-view calendar at the bottom of the page when a day is selected in the month view on mobile display, rather than navigating to the day-view calendar page" />
          </dt>
          <dd className="mb-2 mt-1 flex items-center text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
            <Switch
              defaultSelected={props.userSettings.showInlineDayCalendarInMobileView}
              name="showInlineDayCalendarInMobileView"
            />
          </dd>
        </div>
      </dl>
      <button type="submit" className="mt-6 rounded-lg bg-blue-500 px-4 py-2 text-white">
        Save
      </button>
    </form>
  );
}
