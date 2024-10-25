"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

interface ILogRowProps {
  record: {
    actionType: string;
    additionalData: any;
    success: boolean;
    createdAt: Date;
  };
}

export default function LogRow(props: ILogRowProps) {
  return (
    <tr className="text-sm text-gray-800 even:bg-gray-50">
      <td className="px-4 py-3">{props.record.actionType.toLocaleLowerCase().replace(/_/, " ")}</td>
      <td className="px-4 py-3">{props.record.success ? "Success ✅" : "Failure ❌"}</td>
      <td className="flex flex-row px-4 py-3">
        <span className="mr-1 flex-shrink truncate">{props.record.success ? "Data" : "Error"}</span>
        <Popover placement="right">
          <PopoverTrigger>
            <ArrowTopRightOnSquareIcon className="ml-2 h-5 w-5 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 text-black">
              <div className="whitespace-pre-wrap">
                {props.record.additionalData.error?.toString() || JSON.stringify(props.record.additionalData, null, 2)}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </td>
      <td className="px-4 py-3">{props.record.createdAt.toLocaleString()}</td>
    </tr>
  );
}
