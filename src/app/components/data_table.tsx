"use client";

import { ReactNode } from "react";

interface IDataTableProps {
  columns: string[];
  children: ReactNode;
}

export default function DataTable(props: IDataTableProps) {
  return (
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
      <tbody className="bg-white">{props.children}</tbody>
    </table>
  );
}
