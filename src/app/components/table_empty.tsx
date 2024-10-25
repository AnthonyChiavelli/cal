interface ITableEmptyProps {
  colSpan: number;
  children: React.ReactNode;
}

export default function TableEmpty(props: ITableEmptyProps) {
  return (
    <tr className="bg-white italic">
      <td className="py-3 text-center" colSpan={props.colSpan}>
        {props.children}
      </td>
    </tr>
  );
}
