import { prisma } from "@/db";
import { redirect } from "next/navigation";

async function createStudent(data: FormData) {
  "use server";
  const firstName = data.get("firstName")?.valueOf() as string;
  const lastName = data.get("lastName")?.valueOf() as string;
  const enrolled = data.get("enrolled")?.valueOf() === "true";
  await prisma.student.create({ data: { firstName, lastName, enrolled } });
  redirect("/students");
}

export default function AddStudent() {
  return (
    <div>
      <h1>Create student</h1>
      <form className="flex flex-col gap-3" action={createStudent}>
        <input type="text" name="firstName" required />
        <input type="text" name="lastName" />
        <input type="checkbox" name="checkbox" />
        <button className="border border-slate-200 px-3 py-2">Save</button>
      </form>
    </div>
  );
}
