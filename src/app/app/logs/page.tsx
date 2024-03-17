import DataTable from "@/app/components/data_table";
import LogRow from "@/app/components/log_row";
import { getActionRecords } from "@/app/methods/actionRecord";

export default async function Log() {
  const actionRecords = await getActionRecords();
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
