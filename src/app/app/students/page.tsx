import { PencilIcon } from "@heroicons/react/24/outline";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "@/app/components/button";
import DeleteStudent from "@/app/components/delete_student";
import EntitySearch from "@/app/components/entity_search";
import Modal from "@/app/components/modal";
import StudentPager from "@/app/components/student_pager";
import TableEmpty from "@/app/components/table_empty";
import { getStudents, getTotalStudentCount } from "@/app/methods/student";

const PAGE_SIZE = 10;

async function onClose() {
  "use server";
  redirect("/app/students");
}

async function Students({
  searchParams,
}: {
  searchParams: { page?: Number; search?: string; importComplete: boolean };
}) {
  const students = await getStudents(searchParams);
  const totalStudentCount = await getTotalStudentCount(searchParams);

  return (
    <div>
      <h1>Students</h1>
      <section className="flex items-center gap-2">
        <Link href="/app/students/add">
          <Button dataCy="button-add-student" text="Add Student" flavor="primary" iconName="PlusIcon" />
        </Link>
        <Link href="/app/students/import">
          <Button text="Import Students" flavor="primary" iconName="ArrowUpOnSquareStackIcon" />
        </Link>
      </section>
      <section className="mt-5">
        <EntitySearch placeHolder="Search students" />
      </section>
      <div className="mt-5 flex flex-col gap-y-2">
        <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="bg-slate-400 text-left text-sm font-semibold text-white">
                <th className="px-4 py-3">First Name</th>
                <th className="px-4 py-3">Last Name</th>
                <th className="px-4 py-3">Grade Level</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {!students.length && (
                <TableEmpty colSpan={6}>
                  {searchParams?.search !== "" ? (
                    <>No results found</>
                  ) : (
                    <>
                      No students yet! <Link href={"/app/students/add"}>Add</Link> or{" "}
                      <Link href={"/app/students/import"}>import</Link> some to get started.
                    </>
                  )}
                </TableEmpty>
              )}
              {students.map((student) => (
                <tr key={student.id} className="text-sm text-gray-800 even:bg-gray-50">
                  <td className="px-4 py-3">{student.firstName}</td>
                  <td className="px-4 py-3">{student.lastName}</td>
                  <td className="px-4 py-3">{student.gradeLevel}</td>
                  <td className="px-4 py-3">{student.notes}</td>
                  <td className="px-4 py-3">{dayjs(student.createdAt).format("MM/DD/YYYY")}</td>
                  <td className="relative flex justify-end gap-2 whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                    <Link href={`/app/students/${student.id}`} className="text-gray-800">
                      <PencilIcon width={20} height={20} />
                    </Link>
                    <div className="cursor-pointer text-gray-800">
                      <DeleteStudent studentId={student.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section>
        <StudentPager totalCount={totalStudentCount} pageSize={PAGE_SIZE} />
      </section>
      <Modal open={!!searchParams?.["importComplete"]} close={onClose}>
        <>
          <div className="text-md mb-5">Import successful! Your students are now on the roster!</div>
          <div className="flex justify-end">
            <Button flavor="primary" text="Okay" onClick={onClose} />
          </div>
        </>
      </Modal>
    </div>
  );
}

export default withPageAuthRequired(Students as any, { returnTo: "/app" });
