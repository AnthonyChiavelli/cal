"use client";

import Button from "./button";
import Modal from "./modal";

interface IConfirmationModalProps {
  message: string;
  onAccept: () => void;
  onDeny: () => void;
  open?: boolean;
}

export default function ConfirmationModal(props: IConfirmationModalProps) {
  return (
    <Modal open={!!props.open} close={() => props.onDeny()}>
      <>
        <div className="mb-5">{props.message}</div>
        <div className="flex justify-end gap-3">
          <Button flavor="secondary" onClick={() => props.onDeny()} text="Cancel" />
          <Button flavor="primary" onClick={() => props.onAccept()} text="Okay" />
        </div>
      </>
    </Modal>
  );
}
