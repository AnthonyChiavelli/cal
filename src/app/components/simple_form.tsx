"use client";

import { cn } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Button from "@/app/components/button";
import PhoneInput from "@/app/components/phone_input";
import { ExtractKeyValues } from "@/util/type";

interface ISimpleForm {
  formElements: Array<{
    title: string;
    name: string;
    required?: boolean;
    initialValue?: any;
    type: "text" | "textarea" | "number" | "selectCreateable" | "multiselectCreateable" | "phone";
    additionalProps?: { [k: string]: any };
  }>;
  editMode?: boolean;
  initialValues?: { [k: ExtractKeyValues<ISimpleForm["formElements"], "name">]: any };
  // TODO get this working
  onSubmit: (formData: { [k: ExtractKeyValues<ISimpleForm["formElements"], "name">]: string }) => void;
}

export default function SimpleForm(props: ISimpleForm) {
  type FormType = { [k: ExtractKeyValues<typeof props.formElements, "name">]: string };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<FormType>({
    defaultValues: {
      ...props.formElements.reduce(
        (acc, formElement) =>
          formElement.initialValue ? { ...acc, [formElement.name]: formElement.initialValue } : acc,
        {},
      ),
      ...(props.initialValues || {}),
    },
  });

  return (
    <form role="form" className="flex flex-col gap-3" autoComplete="off" onSubmit={handleSubmit(props.onSubmit)}>
      <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />

      {props.formElements.map((formElement) => {
        return (
          <div className="mt-1 space-y-8 sm:space-y-0" key={formElement.name}>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
              <label htmlFor={formElement.name} className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                {/* {formElement.title} */}
                {formElement.name}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex sm:max-w-md">
                  {(formElement.type === "text" || formElement.type === "number") && (
                    <input
                      aria-labelledby={formElement.name}
                      data-cy={`input-${formElement.name}`}
                      data-testid={`input-${formElement.name}`}
                      type={formElement.type}
                      className={cn("input w-full", {
                        "input-error": errors[formElement.name],
                      })}
                      {...register(formElement.name, { required: formElement.required })}
                      {...formElement.additionalProps}
                    />
                  )}
                  {formElement.type === "phone" && (
                    // @ts-ignore
                    <PhoneInput control={control} name={formElement.name} />
                  )}
                  {(formElement.type === "multiselectCreateable" || formElement.type === "selectCreateable") && (
                    <Controller
                      name={formElement.name}
                      control={control}
                      rules={{ required: formElement.required }}
                      render={({ field }) => (
                        <CreatableSelect
                          inputId={formElement.name}
                          className={cn("w-full", {
                            "input-error": errors[formElement.name],
                            [`creatable-${formElement.name}`]: true,
                          })}
                          isMulti={formElement.type === "multiselectCreateable"}
                          {...formElement.additionalProps}
                          data-testid={`input-${formElement.name}`}
                          data-cy={`input-${formElement.name}`}
                          {...field}
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderRadius: ".5rem",
                              borderWidth: "2px",
                              borderColor: errors[formElement.name] ? "#ff8e93" : "rgb(228, 228, 231)",
                              paddingTop: "7px",
                              paddingBottom: "7px",
                            }),
                          }}
                        />
                      )}
                    />
                  )}
                  {formElement.type === "textarea" && (
                    <textarea
                      aria-labelledby={formElement.name}
                      data-testid={`textarea-${formElement.name}`}
                      data-cy={`textarea-${formElement.name}`}
                      className={cn("textarea w-full", {
                        "textarea-error": errors[formElement.name],
                      })}
                      {...register(formElement.name, { required: formElement.required })}
                      {...formElement.additionalProps}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div>
        <Button
          role="submit"
          dataCy="submit-form"
          // disabled={!isDirty}
          flavor="primary"
          text={props.editMode ? "Update" : "Add"}
          type="submit"
        />
      </div>
    </form>
  );
}
