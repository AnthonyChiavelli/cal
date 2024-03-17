// import { updateOrCreateFamily } from "@/app/actions/families";
// import FamilyForm from "@/app/components/add_family_form";
// import prisma from "@/db";

export default async function AddFamilyPage(props: { params: { familyId: string } }) {
  // if (props.params.familyId) {
  //   // TODO create and use protected method
  //   const family = await pxrisma.family.findUnique({
  //     where: {
  //       id: props.params.familyId,
  //     },
  //     include: {
  //       parents: true,
  //       students: true,
  //     },
  //   });
  //   if (family) {
  //     return (
  //       <div>
  //         <FamilyForm updateOrCreateFamily={updateOrCreateFamily} family={family} />
  //       </div>
  //     );
  //   }
  // } else {
  //   return (
  //     <div>
  //       <FamilyForm updateOrCreateFamily={updateOrCreateFamily} />
  //     </div>
  //   );
  // }
}
