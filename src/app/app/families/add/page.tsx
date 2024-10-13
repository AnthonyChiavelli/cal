import { updateOrCreateFamily } from "@/app/actions";
import FamilyPage from "@/app/components/family_page";

export default function AddFamilyPage() {
  return (
    <div>
      <FamilyPage updateOrCreateFamily={updateOrCreateFamily} />
    </div>
  );
}
