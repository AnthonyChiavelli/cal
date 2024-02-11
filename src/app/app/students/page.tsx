import Button from "@/app/components/button";
import Modal from "@/app/components/modal";
import StudentPager from "@/app/components/student_pager";
import dayjs from "dayjs";
import StudentSearch from "@/app/components/student_search";
import { prisma } from "@/db";
import { PlusIcon, ArrowUpOnSquareStackIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";
import ConfirmationModal from "@/app/components/confirmation_modal";
import DeleteStudent from "@/app/components/delete_student";

const PAGE_SIZE = 10;

async function getStudents(searchParams: { page?: Number; search?: string }) {
  const page = Number(searchParams?.page) || 1;
  const query: any = {};
  if (searchParams?.search) {
    query.where = {
      OR: [
        { firstName: { contains: searchParams.search, mode: "insensitive" } },
        { lastName: { contains: searchParams.search, mode: "insensitive" } },
        { notes: { contains: searchParams.search, mode: "insensitive" } },
      ],
    };
  }

  return await prisma.student.findMany({
    ...query,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
  });
}

async function onClose() {
  "use server";
  redirect("/app/students");
}

async function getTotalStudentCount(searchParams: { search?: string }) {
  const query: any = {};
  if (searchParams?.search) {
    query.where = {
      OR: [
        { firstName: { contains: searchParams.search, mode: "insensitive" } },
        { lastName: { contains: searchParams.search, mode: "insensitive" } },
        { notes: { contains: searchParams.search, mode: "insensitive" } },
      ],
    };
  }
  return await prisma.student.count(query);
}

export default async function Students({
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
        <Button text="Add Student" style="primary" iconName="PlusIcon" href="/app/students/add" />
        <Button
          text="Import Students"
          style="primary"
          iconName="ArrowUpOnSquareStackIcon"
          href="/app/students/import"
        />
      </section>
      <section className="mt-5">
        <StudentSearch />
      </section>
      <div className="mt-5 flex flex-col gap-y-2">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr className="text-sm text-left font-semibold bg-slate-400 text-white">
                <th className="py-3 px-4">First Name</th>
                <th className="py-3 px-4">Last Name</th>
                <th className="py-3 px-4">Grade Level</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {!students.length && (
                <tr className="bg-white italic">
                  <td className="text-center py-3" colSpan={6}>
                    {searchParams?.search !== "" ? (
                      <>No results found</>
                    ) : (
                      <>
                        No students yet! <Link href={"/app/students/add"}>Add</Link> or{" "}
                        <Link href={"/app/students/import"}>import</Link> some to get started.
                      </>
                    )}
                  </td>
                </tr>
              )}
              {students.map((student) => (
                <tr key={student.id} className="text-sm text-gray-800 even:bg-gray-50">
                  <td className="py-3 px-4">{student.firstName}</td>
                  <td className="py-3 px-4">{student.lastName}</td>
                  <td className="py-3 px-4">{student.gradeLevel}</td>
                  <td className="py-3 px-4">{student.notes}</td>
                  <td className="py-3 px-4">{dayjs(student.createdAt).format("MM/DD/YYYY")}</td>
                  <td className="relative whitespace-nowrap py-3 px-4 text-right text-sm font-medium flex justify-end gap-2">
                    <Link href="#" className="text-gray-800">
                      <PencilIcon width={20} height={20} />
                    </Link>
                    <div className="text-gray-800 cursor-pointer">
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
            <Button style="primary" text="Okay" onClick={onClose} />
          </div>
        </>
      </Modal>
    </div>
  );
}
