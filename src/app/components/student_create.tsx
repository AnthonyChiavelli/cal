"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Family } from "@prisma/client";
import FamilyForm from "@/app/components/family_page";
import Modal from "@/app/components/modal";
import SimpleForm from "@/app/components/simple_form";

// TODO extract this to 1 definition
interface FamilyFormData {
  familyName: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent1Phone: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  parent2Phone?: string;
  notes?: string;
}

interface IStudentCreateProps {
  onSubmit: (formData: any) => void;
  families: Array<Family>;
  updateOrCreateFamily: (formData: FamilyFormData, familyId?: string) => Promise<{ success: boolean }>;
}

export default function StudentCreate(props: IStudentCreateProps) {
  const handleSubmit = async (formData: any) => {
    try {
      await props.onSubmit(formData);
    } catch (e) {
      toast.error("Error creating student");
    }
  };

  const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
  const [presetFamilyName, setPresetFamilyName] = useState<string | undefined>(undefined);

  return (
    <>
      <SimpleForm
        formElements={[
          {
            title: "First Name",
            name: "firstName",
            type: "text",
            required: true,
          },
          {
            title: "Last Name",
            name: "lastName",
            type: "text",
            required: true,
          },
          {
            title: "Grade Level",
            name: "gradeLevel",
            type: "number",
            required: true,
            additionalProps: {
              min: 1,
            },
          },
          {
            title: "Areas of need",
            name: "areasOfNeed",
            type: "multiselectCreateable",
            additionalProps: {
              options: [
                { label: "Math", value: "math" },
                { label: "Reading", value: "reading" },
                { label: "Writing", value: "writing" },
                { label: "Behavior", value: "behavior" },
                { label: "Social Skills", value: "socialSkills" },
              ],
            },
          },
          {
            title: "Famliy",
            name: "family",
            type: "selectCreateable",
            required: true,
            additionalProps: {
              options: props.families.map((family) => ({
                label: family.familyName,
                value: family.id,
              })),
              onCreateOption: (newOption: string) => {
                setPresetFamilyName(newOption);
                setShowCreateFamilyModal(true);
              },
            },
          },
          {
            title: "Notes",
            name: "notes",
            type: "textarea",
          },
        ]}
        onSubmit={handleSubmit}
      />
      <Modal open={showCreateFamilyModal} close={() => setShowCreateFamilyModal(false)}>
        {showCreateFamilyModal ? (
          <FamilyForm
            updateOrCreateFamily={props.updateOrCreateFamily}
            presetFamilyName={presetFamilyName}
            noRedirect
            onCreate={() => setShowCreateFamilyModal(false)}
          />
        ) : null}
      </Modal>
    </>
  );
}
