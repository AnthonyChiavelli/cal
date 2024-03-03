"use client";

import EventCreate from "@/app/components/event_create";
import { Student } from "@prisma/client";
import Modal from "./modal";

interface IEventCreateModalProps {
  students: Student[];
  open: boolean;
  onClose: () => void;
}

export default function EventCreateModal(props: IEventCreateModalProps) {
  return (
    <Modal open={props.open} close={props.onClose}>
      <EventCreate students={props.students} />
    </Modal>
  );
}
