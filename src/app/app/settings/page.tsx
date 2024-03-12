import { updateUserSettings } from "@/app/actions/user";
import { getSessionOrFail } from "@/app/actions/util";
import SettingsForm from "@/app/components/settings_form";
import prisma from "@/db";

export default async function SettingsPage() {
  const { session, user } = await getSessionOrFail();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });

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
}
