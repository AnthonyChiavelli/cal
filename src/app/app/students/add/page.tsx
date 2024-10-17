import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { updateOrCreateFamily } from "@/app/actions";
import { updateOrCreateStudent } from "@/app/actions/student";
import StudentCreate from "@/app/components/student_page";
import { getAreasOfNeed } from "@/app/methods/areaOfNeed";
import { getFamilies } from "@/app/methods/family";

async function AddStudent() {
  const families = await getFamilies({});
  const areasOfNeed = await getAreasOfNeed();
  return (
    <div>
      <h1>Create student</h1>
      <StudentCreate
        updateOrCreateStudent={updateOrCreateStudent}
        families={families}
        areasOfNeed={areasOfNeed}
        updateOrCreateFamily={updateOrCreateFamily}
      />
    </div>
  );
}

export default withPageAuthRequired(AddStudent as any, { returnTo: "/app" });
