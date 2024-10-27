import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import Button from "@/app/components/button";
import DataTable from "@/app/components/data_table";
import EntitySearch from "@/app/components/entity_search";
import Modal from "@/app/components/modal";
import Pager from "@/app/components/pager";
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

  const emptyTableMessage =
    searchParams?.search !== "" ? (
      <>No results found</>
    ) : (
      <>
        No students yet! <Link href={"/app/students/add"}>Add</Link> or{" "}
        <Link href={"/app/students/import"}>import</Link> some to get started.
      </>
    );

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
      <section className="mt-5 flex flex-col gap-y-2">
        <DataTable
          columns={["First Name", "Last Name", "Grade Level", "Notes", "Created At"]}
          noEntitiesMessage={emptyTableMessage}
        >
          {students.map((student) => ({
            rowKey: student.id,
            rowLink: `/app/students/${student.id}`,
            rowProps: {
              className: "cursor-pointer hover:bg-sky-100",
            },
            cells: [
              student.firstName,
              student.lastName,
              student.gradeLevel,
              student.notes,
              dayjs(student.createdAt).format("MM/DD/YYYY"),
            ],
          }))}
        </DataTable>
      </section>
      <section>
        <Pager totalCount={totalStudentCount} pageSize={PAGE_SIZE} />
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
