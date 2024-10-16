import { updaterOrCreateStudent, updateOrCreateFamily } from "@/app/actions";
import StudentPage from "@/app/components/student_page";
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

  return (
    <StudentPage
      updaterOrCreateStudent={updaterOrCreateStudent}
      updateOrCreateFamily={updateOrCreateFamily}
      student={student}
      families={families}
    />
  );
}
