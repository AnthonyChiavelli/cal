import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { updateOrCreateFamily } from "@/app/actions";
import { createStudent } from "@/app/actions/student";
import StudentCreate from "@/app/components/student_create";
import { getFamilies } from "@/app/methods/family";

async function AddStudent() {
  const families = await getFamilies({});
  return (
    <div>
      <h1>Create student</h1>
      <StudentCreate onSubmit={createStudent} families={families} updateOrCreateFamily={updateOrCreateFamily} />
    </div>
  );
}

export default withPageAuthRequired(AddStudent as any, { returnTo: "/app" });
