import { updateOrCreateFamily } from "@/app/actions";
import FamilyForm from "@/app/components/family_form";

export default function AddFamilyPage() {
  return (
    <div>
      <FamilyForm updateOrCreateFamily={updateOrCreateFamily} />
    </div>
  );
}
