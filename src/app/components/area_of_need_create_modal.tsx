"use client";

import { useMemo, useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { Tooltip } from "@nextui-org/react";
import { AreaOfNeed } from "@prisma/client";
import Modal from "@/app/components/modal";

interface IAreaOfNeedCreateModalProps {
  areasOfNeed: AreaOfNeed[];
  onCreate: (name: string) => void;
  open: boolean;
  onDismiss: () => void;
}

export default function AreaOfNeedCreateModal(props: IAreaOfNeedCreateModalProps) {
  const [name, setName] = useState("");
  const nameAlreadyTaken = useMemo(
    () => props.areasOfNeed.find((a) => a.name.toLowerCase() === name.toLowerCase()) !== undefined,
    [name, props.areasOfNeed],
  );
  const buttonDisabled = useMemo(() => name.length === 0 || nameAlreadyTaken, [name, nameAlreadyTaken]);

  const handleCreate = () => {
    setName("");
    props.onCreate(name);
  };

  return (
    <Modal open={props.open} close={props.onDismiss}>
      <div>
        <h5 className="flex flex-row items-center">
          Create new &apos;Area of need&apos;
          <Tooltip
            content={
              <div className="text-black p-3">
                <div>
                  An &apos;area of need&apos; is an academic subject that a student may have particular trouble with.
                </div>
                <div>Students can be associated with multiple areas of need.</div>
              </div>
            }
            placement="top"
          >
            <QuestionMarkCircleIcon className="ml-3" width={16} height={16} />
          </Tooltip>
        </h5>
        <div className="my-3">
          <input
            required
            data-testid="area-of-need-name"
            className="input input-bordered w-full"
            placeholder="Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="my-2">{nameAlreadyTaken && <div className="text-red-500">Name already taken</div>}</div>
        <button disabled={buttonDisabled} className="btn btn-neutral" onClick={handleCreate}>
          Create
        </button>
      </div>
    </Modal>
  );
}
