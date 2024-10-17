"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AreaOfNeed, Family, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import FamilyForm from "@/app/components/family_page";
import LoadingPane from "@/app/components/loading_pane";
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

// TODO extract this to 1 definition
interface StudentFormData {
  firstName: string;
  lastName: string;
  gradeLevel: number;
  areasOfNeed: Array<{ value: string }>;
  familyId?: { value: string };
  notes?: string;
}

interface IStudentCreateProps {
  // onSubmit: (formData: any) => void;
  families: Array<Family>;
  student?: Prisma.StudentGetPayload<{ include: { areaOfNeed: true; family: true } }>;
  updateOrCreateFamily: (formData: FamilyFormData, familyId?: string) => Promise<{ success: boolean }>;
  updateOrCreateStudent: (formData: StudentFormData, studentId?: string) => Promise<{ success: boolean }>;
  areasOfNeed: AreaOfNeed[];
}

export default function StudentPage(props: IStudentCreateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      await props.updateOrCreateStudent(formData, props.student?.id);
    } catch (e) {
      setIsLoading(false);
      toast.error("Error creating student");
    }
    router.push("/app/students");
    toast.success(`Student ${props.student?.id ? "updated" : "created"}`);
    setIsLoading(false);
  };

  const initialValues = useMemo(() => {
    return {
      firstName: props.student?.firstName,
      lastName: props.student?.lastName,
      gradeLevel: props.student?.gradeLevel,
      areasOfNeed: props.student?.areaOfNeed?.map((area) => ({ value: area.id, label: area.name })),
      family: props.student?.family?.id
        ? { value: props.student?.family?.id, label: props.student?.family?.familyName }
        : undefined,
      notes: props.student?.notes,
    };
  }, [props.student]);

  const [showCreateFamilyModal, setShowCreateFamilyModal] = useState(false);
  const [presetFamilyName, setPresetFamilyName] = useState<string | undefined>(undefined);

  return (
    <>
      {isLoading && <LoadingPane />}
      <SimpleForm
        initialValues={initialValues}
        editMode={props.student !== undefined}
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
              options: props.areasOfNeed.map((area) => ({
                label: area.name,
                value: area.id,
              })),
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
