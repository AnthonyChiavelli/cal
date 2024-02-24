import { prisma } from "@/db";

interface IClassProps {
  params: {
    classId: string;
  };
}

async function fetchClass(classId: string) {
  return prisma.class.findFirstOrThrow({ where: { id: classId } });
}

export default async function Class(props: IClassProps) {
  const classObj = await fetchClass(props.params.classId);
  return <code className="whitespace-pre">sfd: {JSON.stringify(classObj, null, 2)}</code>;
}
