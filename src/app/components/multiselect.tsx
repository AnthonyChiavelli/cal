"use client";

import { Options } from "react-select";
import CreatableSelect from "react-select/creatable";

interface IMultiSelectProps {
  options: Options<{ label: string; value: string }>;
}

export default function Multiselect(props: IMultiSelectProps) {
  return (
    <CreatableSelect
      isMulti
      options={props.options}
      className="w-full p-1"
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "12px",
          borderWidth: "2px",
          borderColor: "rgb(228, 228, 231)",
          paddingTop: "7px",
          paddingBottom: "7px",
        }),
      }}
    />
  );
}
