"use client";

import { ReactNode } from "react";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface IDataTableProps {
  columns: string[];
  children: Array<{ rowProps?: any; cells: ReactNode[]; rowKey: string; rowLink?: string }>;
  noEntitiesMessage?: ReactNode;
}

export default function DataTable(props: IDataTableProps) {
  const router = useRouter();
  return (
    <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr className="bg-slate-400 text-left text-sm font-semibold text-white">
            {props.columns.map((column) => {
              return (
                <th key={column} className="px-4 py-3">
                  {column}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white">
          {props.children.map((row) => (
            <tr
              key={row.rowKey}
              {...row.rowProps}
              className={cn("text-sm text-gray-800 even:bg-gray-50", row.rowProps?.className)}
              onClick={() => row.rowLink && router.push(row.rowLink)}
            >
              {row.cells.map((cell: ReactNode, index: number) => (
                <td key={index} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {props.children.length === 0 && (
            <tr>
              <td colSpan={props.columns.length} className="py-4 text-center">
                {props.noEntitiesMessage || "No entities found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
