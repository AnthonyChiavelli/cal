import { getStudent } from "@/app/methods/student";

interface IStudentPageProps {
  params: {
    studentId: string;
  };
}

export default async function StudentPage(props: IStudentPageProps) {
  const student = await getStudent(props.params.studentId);

  return <div>{JSON.stringify(student)}</div>;
}
