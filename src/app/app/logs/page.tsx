import DataTable from "@/app/components/data_table";
import LogRow from "@/app/components/log_row";
import TableEmpty from "@/app/components/table_empty";
import { getActionRecords } from "@/app/methods/actionRecord";

export default async function Log() {
  const actionRecords = await getActionRecords();
  return (
    <div>
      <h1 className="">Logs</h1>
      <DataTable columns={["Action", "Result", "Data", "Date"]}>
        <>
          {actionRecords.map((record) => (
            <LogRow key={record.id} record={record} />
          ))}
          {!actionRecords.length && <TableEmpty colSpan={4}>No logs yet!</TableEmpty>}
        </>
      </DataTable>
    </div>
  );
}
