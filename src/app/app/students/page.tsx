import { prisma } from "@/db";
import Link from "next/link";

export default async function Students() {
  const students = await prisma.student.findMany();
  // await prisma.student.create({data: {
  //     firstName: "Horsedaddy",
  //     lastName: "McHoolio",
  //     enrolled: true
  // }})
  return (
    <div>
      <header className="flex flex-row align-items-center justify-between">
        <h1>Students</h1>
        <Link className="border border-slate-300 px-3 py-2" href="/students/add">
          Add Student
        </Link>
      </header>
      {students.map((student) => (
        <div key={student.id}>{student.firstName}</div>
      ))}
    </div>
  );
}
