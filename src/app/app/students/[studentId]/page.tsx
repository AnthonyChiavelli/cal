import prisma from "@/db";

interface IStudentPageProps {
  params: {
    studentId: string;
  };
}

export default async function StudentPage(props: IStudentPageProps) {
  const student = await prisma.student.findFirst({ where: { OR: [{ id: props.params.studentId }] } });

  return <div>{JSON.stringify(student)}</div>;
}
