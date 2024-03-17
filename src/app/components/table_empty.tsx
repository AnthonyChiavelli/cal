interface ITableEmptyProps {
  colSpan: number;
  children: React.ReactNode;
}

export default function TableEmpty(props: ITableEmptyProps) {
  return (
    <tr className="bg-white italic">
      <td className="text-center py-3" colSpan={props.colSpan}>
        {props.children}
      </td>
    </tr>
  );
}
