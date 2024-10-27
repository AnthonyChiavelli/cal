import Link from "next/link";
import Button from "@/app/components/button";
import DataTable from "@/app/components/data_table";
import EntitySearch from "@/app/components/entity_search";
import { getFamilies } from "@/app/methods/family";

export default async function FamiliesPage({ searchParams }: { searchParams: { search?: string } }) {
  const families = await getFamilies(searchParams);
  return (
    <div>
      <h1>Families</h1>
      <section className="mb-5 flex items-center gap-2">
        <Link href="/app/families/add">
          <Button flavor="primary" text="Add Family" dataCy="button-add-family" iconName="PlusIcon" />
        </Link>
      </section>
      <section className="mt-5">
        <EntitySearch placeHolder="Search families" />
      </section>
      <section className="mt-5">
        <DataTable columns={["Family Name", "Parents", "Balance", "Created At"]} noEntitiesMessage="No families found">
          {families.map((family) => ({
            rowKey: family.id,
            rowLink: `/app/families/${family.id}`,
            rowProps: {
              className: "cursor-pointer hover:bg-sky-100",
            },
            cells: [
              family.familyName,
              family.parents.map((p) => p.firstName).join(", "),
              family.balance.toFixed(2),
              family.createdAt.toLocaleString(),
            ],
          }))}
        </DataTable>
      </section>
    </div>
  );
}
