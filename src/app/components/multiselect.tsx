"use client";

import { Options } from "react-select";
import CreatableSelect from "react-select/creatable";

interface IMultiSelectProps {
  options: Options<{ label: string; value: string }>;
}

export default function Multiselect(props: IMultiSelectProps) {
  return <CreatableSelect isMulti options={props.options} className="multiselect-outer" />;
}
