import { updateOrCreateFamily, deleteFamily } from "@/app/actions";
import FamilyPage from "@/app/components/family_page";
import ResourceNotFound from "@/app/components/resource_not_found";
import { getFamily } from "@/app/methods/family";

export default async function FamilyServerPage(props: { params: { familyId: string } }) {
  const family = await getFamily(props.params.familyId);

  if (props.params.familyId && !family) {
    return <ResourceNotFound resourceName="Family" />;
  }

  if (family) {
    return (
      <div>
        <FamilyPage updateOrCreateFamily={updateOrCreateFamily} deleteFamily={deleteFamily} family={family} />
      </div>
    );
  }
}
