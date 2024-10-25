import { Prisma } from "@prisma/client";
import Link from "next/link";

interface IFamilyRowProps {
  family: Prisma.FamilyGetPayload<{
    include: { parents: true; students: true };
  }>;
}

export default function FamilyRow(props: IFamilyRowProps): JSX.Element {
  return (
    <tr className="text-sm text-gray-800 even:bg-gray-50">
      <td className="px-4 py-3">
        <Link href={`/app/families/${props.family.id}`}>{props.family.familyName}</Link>
      </td>
      <td className="px-4 py-3">{props.family.parents.map((p) => p.firstName).join(", ")}</td>
      <td className="px-4 py-3">{props.family.createdAt.toLocaleString()}</td>
    </tr>
  );
}
