import { updateOrCreateStudent, updateOrCreateFamily } from "@/app/actions";
import ResourceNotFound from "@/app/components/resource_not_found";
import StudentPage from "@/app/components/student_page";
import { getAreasOfNeed } from "@/app/methods/areaOfNeed";
import { getFamilies } from "@/app/methods/family";
import { getStudent } from "@/app/methods/student";

interface IStudentPageProps {
  params: {
    studentId: string;
  };
}

export default async function StudentServerPage(props: IStudentPageProps) {
  const student = await getStudent(props.params.studentId);
  const families = await getFamilies({});
  const areasOfNeed = await getAreasOfNeed();

  if (student === null) {
    return <ResourceNotFound resourceName="Student" />;
  }

  return (
    <StudentPage
      updateOrCreateStudent={updateOrCreateStudent}
      updateOrCreateFamily={updateOrCreateFamily}
      areasOfNeed={areasOfNeed}
      student={student}
      families={families}
    />
  );
}
