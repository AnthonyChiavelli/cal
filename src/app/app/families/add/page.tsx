import { updateOrCreateFamily } from "@/app/actions/family";
import FamilyForm from "@/app/components/add_family_form";

export default function AddFamilyPage() {
  return (
    <div>
      <FamilyForm updateOrCreateFamily={updateOrCreateFamily} />
    </div>
  );
}
