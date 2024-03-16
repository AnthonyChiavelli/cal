"use client";

import { Student, UserSettings } from "@prisma/client";
import EventCreate from "@/app/components/event_create";
import Modal from "./modal";

interface IEventCreateModalProps {
  students: Student[];
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  presetDate: Date;
}

export default function EventCreateModal(props: IEventCreateModalProps) {
  return (
    <Modal open={props.open} close={props.onClose}>
      <EventCreate students={props.students} settings={props.settings} onCloseParentModal={props.onClose} />
    </Modal>
  );
}
