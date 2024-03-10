import { FamilyWithRelations } from "@/types";
import Link from "next/link";

interface IFamilyRowProps {
  family: FamilyWithRelations;
}

export default function FamilyRow(props: IFamilyRowProps) {
  return (
    <tr className="text-sm text-gray-800 even:bg-gray-50">
      <td className="py-3 px-4">{props.family.familyName}</td>
      <td className="py-3 px-4">{props.family.parents.map((p) => p.firstName).join(", ")}</td>
      <td className="py-3 px-4">{props.family.students.map((p) => p.firstName).join(", ")}</td>
      <td className="py-3 px-4">{props.family.createdAt.toLocaleString()}</td>
      <td>
        <Link href={`/app/families/${props.family.id}`}>Edit</Link>
      </td>
    </tr>
  );
}
