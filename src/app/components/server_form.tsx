import Button from "@/app/components/button";

export interface IFieldSpec {
  label: string;
  name: string;
  type: "text" | "date" | "radio" | "number";
  inputProps?: { [k: string]: string };
  customElement?: JSX.Element;
  options?: Array<{ id: string; label: string }>;
}

interface IFormProps {
  submitForm: (formData: FormData) => void;
  formSpec: Array<IFieldSpec>;
}

export default function ServerForm(props: IFormProps) {
  const simpleFieldTypes = ["text", "date", "number"];

  const renderField = (fieldSpec: IFieldSpec) => {
    return (
      <div className="mt-1 space-y-8 sm:space-y-0">
        <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
          <label htmlFor={fieldSpec.name} className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
            {fieldSpec.label}
          </label>
          <div className="mt-2 sm:col-span-2 sm:mt-0">
            <div className="flex rounded-md sm:max-w-md">
              {simpleFieldTypes.includes(fieldSpec.type) && (
                <input
                  type={fieldSpec.type}
                  name={fieldSpec.name}
                  id={fieldSpec.name}
                  autoComplete="false"
                  data-lpignore="true"
                  className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              )}
              {fieldSpec.type === "radio" && (
                <fieldset className="flex gap-5">
                  {fieldSpec.options?.map((option) => (
                    <div className="flex gap-2" key={option.id}>
                      <input
                        type="radio"
                        name={fieldSpec.name}
                        id={option.id}
                        autoComplete="false"
                        data-lpignore="true"
                        // className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                      <label htmlFor={option.id}>{option.label}</label>
                    </div>
                  ))}
                </fieldset>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <form className="flex flex-col gap-3" action={props.submitForm} autoComplete="off">
      {props.formSpec.map((formSpec) => renderField(formSpec))}
      <div>
        <Button flavor="primary" text="Add" type="submit" />
      </div>
    </form>
  );
}
