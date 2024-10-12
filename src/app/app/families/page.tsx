import { Prisma } from "@prisma/client";
import Link from "next/link";
import Button from "@/app/components/button";
import DataTable from "@/app/components/data_table";
import FamilyRow from "@/app/components/family_row";
import { getFamilies } from "@/app/methods/family";

export default async function FamiliesPage() {
  const families = await getFamilies({});
  return (
    <div>
      <h1>Families</h1>
      <section className="flex items-center gap-2 mb-5">
        <Link href="/app/families/add">
          <Button flavor="primary" text="Create Family" />
        </Link>
      </section>
      <DataTable columns={["Family Name", "Parents", "Created At"]}>
        {families.map(
          (
            family: Prisma.FamilyGetPayload<{
              include: { parents: true; students: true };
            }>,
          ) => (
            <FamilyRow key={family.id} family={family} />
          ),
        )}
        {!families.length && (
          <tr>
            <td colSpan={4} className="text-center py-4">
              No families found
            </td>
          </tr>
        )}
      </DataTable>
    </div>
  );
}
