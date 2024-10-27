import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import DataTable from "@/app/components/data_table";
import { getActionRecords } from "@/app/methods/actionRecord";

export default async function Log() {
  const actionRecords = await getActionRecords();
  return (
    <div>
      <h1 className="">Logs</h1>
      <DataTable columns={["Action", "Result", "Data", "Date"]} noEntitiesMessage="No logs yet">
        {actionRecords.map((record) => ({
          rowKey: record.id,
          cells: [
            record.actionType.toLocaleLowerCase().replace(/_/, " "),
            record.success ? "Success ✅" : "Failure ❌",
            <>
              <span className="mr-1 flex-shrink truncate">{record.success ? "Data" : "Error"}</span>
              <Popover placement="right">
                <PopoverTrigger>
                  <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5 cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2 text-black">
                    <div className="whitespace-pre-wrap">
                      {/* @ts-ignore */}
                      {record.additionalData?.error?.toString() || JSON.stringify(record.additionalData, null, 2)}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>,
            record.createdAt.toLocaleString(),
          ],
        }))}
      </DataTable>
    </div>
  );
}
