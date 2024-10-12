import { Prisma } from "@prisma/client";
import Link from "next/link";
import Button from "@/app/components/button";
import DataTable from "@/app/components/data_table";
import EntitySearch from "@/app/components/entity_search";
import FamilyRow from "@/app/components/family_row";
import { getFamilies } from "@/app/methods/family";

export default async function FamiliesPage({ searchParams }: { searchParams: { search?: string } }) {
  const families = await getFamilies(searchParams);
  return (
    <div>
      <h1>Families</h1>
      <section className="flex items-center gap-2 mb-5">
        <Link href="/app/families/add">
          <Button flavor="primary" text="Add Family" dataCy="button-add-family" iconName="PlusIcon" />
        </Link>
      </section>
      <section className="mt-5">
        <EntitySearch placeHolder="Search families" />
      </section>
      <section className="mt-5">
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
      </section>
    </div>
  );
}
