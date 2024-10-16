import { updateOrCreateFamily, deleteFamily, getSessionOrFail } from "@/app/actions";
import FamilyPage from "@/app/components/family_page";
import ResourceNotFound from "@/app/components/resource_not_found";
import prisma from "@/db";

export default async function FamilyServerPage(props: { params: { familyId: string } }) {
  const { user } = await getSessionOrFail();
  // TODO create and use protected method

  const family = await prisma.family.findUnique({
    where: {
      id: props.params.familyId,
      ownerId: user.email,
    },
    include: {
      parents: true,
      students: true,
    },
  });

  if (props.params.familyId && !family) {
    return <ResourceNotFound resourceName="Family" />;
  }

  return (
    <div>
      <FamilyPage updateOrCreateFamily={updateOrCreateFamily} deleteFamily={deleteFamily} family={family} />
    </div>
  );
}
