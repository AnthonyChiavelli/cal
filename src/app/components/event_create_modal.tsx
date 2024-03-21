"use client";

import { Student, UserSettings } from "@prisma/client";
import EventCreate from "@/app/components/event_create";
import Modal from "./modal";

interface IEventCreateModalProps {
  students: Student[];
  open: boolean;
  onClose: () => void;
  settings: UserSettings;
  presetDate?: { date?: Date; time?: Date };
}

export default function EventCreateModal(props: IEventCreateModalProps, ref: any) {
  return (
    <Modal open={props.open} close={props.onClose}>
      <>
        <EventCreate
          students={props.students}
          settings={props.settings}
          onCloseParentModal={props.onClose}
          presetDate={props.presetDate}
        />
      </>
    </Modal>
  );
}
