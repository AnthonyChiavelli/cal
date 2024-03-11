import DataTable from "@/app/components/data_table";
import LogRow from "@/app/components/log_row";
import { prisma } from "@/db";

export default async function Log() {
  const actionRecords = await prisma.actionRecord.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="">Log</h1>
      <DataTable columns={["Action", "Result", "Data", "Date"]}>
        <>
          {actionRecords.map((record) => (
            <LogRow key={record.id} record={record} />
          ))}
        </>
      </DataTable>
    </div>
  );
}
