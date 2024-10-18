import { updateOrCreateAreaOfNeed, deleteAreaOfNeed } from "@/app/actions/area_of_need";
import AreasOfNeedPage from "@/app/components/areas_of_need_page";
import { getAreasOfNeed } from "@/app/methods/areaOfNeed";

export default async function AreasOfNeedServerPage() {
  const areasOfNeed = await getAreasOfNeed();

  return (
    <AreasOfNeedPage
      areasOfNeed={areasOfNeed}
      updateOrCreateAreaOfNeed={updateOrCreateAreaOfNeed}
      deleteAreaOfNeed={deleteAreaOfNeed}
    />
  );
}
