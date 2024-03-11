"use client";

import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteStudent } from "../actions/students";
import ConfirmationModal from "./confirmation_modal";

interface IDeleteStudent {
  studentId: string;
}

export default function DeleteStudent(props: IDeleteStudent) {
  const [showModal, setShowModal] = React.useState(false);
  const handleAccept = () => {
    deleteStudent(props.studentId);
    setShowModal(false);
  };
  return (
    <>
      <TrashIcon width={20} height={20} onClick={() => setShowModal(true)} />
      <ConfirmationModal
        open={showModal}
        message="Are you sure you want to delete?"
        onAccept={handleAccept}
        onDeny={() => setShowModal(false)}
      />
    </>
  );
}
