import { getSession } from "@auth0/nextjs-auth0";
import { updateUserSettings } from "@/app/actions/user";
import SettingsForm from "@/app/components/settings_form";
import { prisma } from "@/db";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    return <div>Unauthorized</div>;
  }
  const user = await prisma.user.findFirst({ where: { email: session.user.email } });
  if (!user) {
    return <div>Unauthorized</div>;
  }
  const userSettings = await prisma.userSettings.findFirst({ where: { userEmail: user.email } });
  const basePricing = userSettings?.basePrice || 0;

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Settings</h3>
      </div>
      <SettingsForm updateUserSettings={updateUserSettings} basePricing={Number(basePricing)} />
    </div>
  );
}
