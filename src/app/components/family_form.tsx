"use client";

import { useCallback, useMemo, useState } from "react";
import { cn } from "@nextui-org/react";
import { toast } from "react-toastify";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingPane from "@/app/components/loading_pane";
import SimpleForm from "@/app/components/simple_form";
import Button from "./button";
import ConfirmationModal from "./confirmation_modal";

interface FamilyFormData {
  familyId?: string;
  familyName: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent1Phone: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  parent2Phone?: string;
  notes?: string;
}

interface IAddFamilyFormProps {
  updateOrCreateFamily: (formData: FamilyFormData, familyId?: string) => Promise<{ success: boolean }>;
  deleteFamily?: (familyId: string) => Promise<{ success: boolean }>;
  family?: Prisma.FamilyGetPayload<{
    include: { parents: true; students: true };
  }> | null;
  presetFamilyName?: string | undefined;
  noRedirect?: boolean;
  onCreate?: () => void;
}

export default function FamilyForm(props: IAddFamilyFormProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hasAssociatedStudents = useMemo(
    () => props.family?.students && props.family?.students?.length > 0,
    [props.family],
  );

  const initialFieldsToPopulate = useMemo(() => {
    return {
      familyName: props.family?.familyName,
      parent1FirstName: props.family?.parents[0].firstName,
      parent1LastName: props.family?.parents[0].lastName,
      parent1Phone: props.family?.parents[0].phone,
      parent2FirstName: props.family?.parents[1]?.firstName,
      parent2LastName: props.family?.parents[1]?.lastName,
      parent2Phone: props.family?.parents[1]?.phone,
      notes: props.family?.notes,
    };
  }, [props.family]);

  const handleSubmit = useCallback(
    async (formData: FamilyFormData) => {
      try {
        setIsLoading(true);
        const res = await props.updateOrCreateFamily(formData, props.family?.id);
        setIsLoading(false);
        if (res.success) {
          toast.success(`Family ${props.family?.id ? "updated" : "created"}`);
          if (!props.noRedirect && !props.family?.id) {
            router.push("/app/families");
          }
          router.refresh();
          if (props.onCreate) {
            props.onCreate();
          }
        } else {
          throw new Error("Server error");
        }
      } catch {
        setIsLoading(false);
        toast.error("Error creating family");
      }
    },
    [props, router],
  );

  const handleDeleteFamily = useCallback(async () => {
    setIsLoading(true);
    try {
      if (props.deleteFamily && props.family) {
        setIsLoading(true);
        const res = await props.deleteFamily(props.family.id);
        if (!res.success) {
          throw new Error("Server error");
        }
        setShowDeleteModal(false);
        setIsLoading(false);
        router.push("/app/families");
      } else {
        throw new Error("Client error");
      }
    } catch {
      setIsLoading(false);
      toast.error("Failed to delete family");
    }
  }, [props, router]);

  return (
    <>
      {isLoading && <LoadingPane />}
      {props.family && (
        <div className="my-5 mb-5">
          <h2>Family Information</h2>
          <div className="mt-1 space-y-8 sm:space-y-0" key="associated-students">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Associated students
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex sm:max-w-md" key="associated-students">
                  {props.family?.students.map((student) => (
                    <Link href={`/app/students/${student.id}`} key={student.id}>
                      <span data-testid={`family-student-${student.id}`}>
                        {student.firstName} {student.lastName}
                      </span>
                    </Link>
                  ))}
                  {props.family?.students.length === 0 && (
                    <p className="italic">No students associated with this family</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-5">
        <h2>Family Profile</h2>
        <SimpleForm
          // @ts-ignore
          onSubmit={handleSubmit}
          editMode={!!props.family}
          // initialValues={props.family ? initialFieldsToPopulate : {}}
          initialValues={initialFieldsToPopulate}
          formElements={
            [
              {
                title: "Family Name",
                name: "familyName",
                type: "text",
                initialValue: props.presetFamilyName,
                required: true,
              },
              {
                title: "Parent 1 First Name",
                name: "parent1FirstName",
                type: "text",
                required: true,
              },
              {
                title: "Parent 1 Last Name",
                name: "parent1LastName",
                type: "text",
                required: true,
              },
              {
                title: "Parent 1 Phone",
                name: "parent1Phone",
                type: "phone",
                required: true,
              },
              {
                title: "Parent 2 First Name",
                name: "parent2FirstName",
                type: "text",
              },
              {
                title: "Parent 2 Last Name",
                name: "parent2LastName",
                type: "text",
              },
              {
                title: "Parent 2 Phone",
                name: "parent2Phone",
                type: "phone",
                additionalProps: {
                  placeholder: "888 888 8888",
                  pattern: "[0-9]{3} [0-9]{3} [0-9]{4}",
                  maxlength: "12",
                },
              },
              {
                title: "Notes",
                name: "notes",
                type: "textarea",
              },
            ] as const
          }
        />
      </div>
      <ConfirmationModal
        open={showDeleteModal}
        message="Are you sure you want to delete? This cannot be undone."
        onAccept={handleDeleteFamily}
        onDeny={() => setShowDeleteModal(false)}
      />
      {props.family && props.deleteFamily && (
        <div
          className={cn({ "tooltip tooltip-right": hasAssociatedStudents })}
          data-tip="Cannot delete a family with associated students"
        >
          <Button
            text="Delete family"
            flavor="danger"
            dataTestId="delete-family"
            disabled={hasAssociatedStudents}
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      )}
    </>
  );
}
