"use client";

interface IDataTableProps {
  columns: string[];
  children: React.ReactNode;
}

export default function DataTable(props: IDataTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr className="text-sm text-left font-semibold bg-slate-400 text-white">
          {props.columns.map((column) => {
            return (
              <th key={column} className="py-3 px-4">
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
