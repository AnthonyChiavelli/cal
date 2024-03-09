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
      <td className="py-3 px-4">{props.record.actionType.toLocaleLowerCase().replace(/_/, " ")}</td>
      <td className="py-3 px-4">{props.record.success ? "Success ✅" : "Failure ❌"}</td>
      <td className="flex flex-row py-3 px-4">
        <span className="mr-1 truncate flex-shrink">{props.record.success ? "Data" : "Error"}</span>
        <Popover placement="right">
          <PopoverTrigger>
            <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2 cursor-pointer" />
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
      <td className="py-3 px-4">{props.record.createdAt.toLocaleString()}</td>
    </tr>
  );
}
