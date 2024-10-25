"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AreaOfNeed } from "@prisma/client";
import AreaOfNeedCreateModal from "@/app/components/area_of_need_create_modal";
import Button from "@/app/components/button";
import ConfirmationModal from "@/app/components/confirmation_modal";
import DataTable from "@/app/components/data_table";
import LoadingPane from "@/app/components/loading_pane";
import TableEmpty from "@/app/components/table_empty";

interface IAreasOfNeedPage {
  areasOfNeed: AreaOfNeed[];
  updateOrCreateAreaOfNeed: (name: string, areaOfNeedId?: string) => Promise<{ success: boolean }>;
  deleteAreaOfNeed: (areaOfNeedId: string) => Promise<{ success: boolean }>;
}

export default function AreasOfNeedPage(props: IAreasOfNeedPage) {
  const [isLoading, setIsLoading] = useState(false);
  const [areaOfNeedToDelete, setAreaOfNeedToDelete] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = useCallback(async () => {
    if (areaOfNeedToDelete === null) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await props.deleteAreaOfNeed(areaOfNeedToDelete);
      if (!response.success) {
        throw new Error("Failed to delete area of need");
      }
      toast.success("Successfully deleted area of need");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create area of need");
    }
    setIsLoading(false);
    setAreaOfNeedToDelete(null);
  }, [areaOfNeedToDelete, props]);

  const handleCreate = useCallback(
    async (name: string) => {
      try {
        setIsLoading(true);
        const response = await props.updateOrCreateAreaOfNeed(name);
        if (!response.success) {
          throw new Error("Failed to create area of need");
        }
        toast.success("Successfully created area of need");
        setShowCreateModal(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create area of need");
      }
      setIsLoading(false);
    },
    [props],
  );

  return (
    <div>
      {isLoading && <LoadingPane />}
      <section className="mt-5">
        <h1 className="">Areas of Need</h1>
        <DataTable columns={["Area", "Created At", "Actions"]}>
          {props.areasOfNeed.map((area) => (
            <tr key={area.id} className="text-sm text-gray-800 even:bg-gray-50">
              <td className="px-4 py-3">{area.name}</td>
              <td className="px-4 py-3">{area.createdAt.toLocaleString()}</td>
              <td className="flex flex-row gap-2 px-4 py-3">
                <button className="text-red-500 hover:text-red-700" onClick={() => setAreaOfNeedToDelete(area.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!props.areasOfNeed.length && <TableEmpty colSpan={4}>No areas of need yet!</TableEmpty>}
        </DataTable>
      </section>
      <section className="mt-5">
        <Button
          flavor="primary"
          text="Add Area of Need"
          dataCy="button-add-area-of-need"
          iconName="PlusIcon"
          onClick={() => setShowCreateModal(true)}
        />
      </section>
      <AreaOfNeedCreateModal
        open={showCreateModal}
        areasOfNeed={props.areasOfNeed}
        onCreate={handleCreate}
        onDismiss={() => setShowCreateModal(false)}
      />
      <ConfirmationModal
        message={`Are you sure you want to delete '${props.areasOfNeed.find((a) => a.id === areaOfNeedToDelete)?.name || "unknown"}'?`}
        open={areaOfNeedToDelete !== null}
        onAccept={handleDelete}
        onDeny={() => setAreaOfNeedToDelete(null)}
      />
    </div>
  );
}
