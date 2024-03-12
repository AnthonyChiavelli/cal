import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getUserSettings, updateUserSettings } from "@/app/actions/user";
import SettingsForm from "@/app/components/settings_form";

export default withPageAuthRequired(async function SettingsPage() {
  const userSettings = await getUserSettings();

  if (!userSettings) {
    return <div>Unauthorized</div>;
  }

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Settings</h3>
      </div>
      <SettingsForm updateUserSettings={updateUserSettings} userSettings={userSettings} />
    </div>
  );
});
