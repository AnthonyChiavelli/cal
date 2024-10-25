"use client";

import * as Icons from "@heroicons/react/24/outline";
import classNames from "classnames";

interface IButtonProps {
  onClick?: () => void;
  className?: string;
  flavor: "primary" | "secondary" | "danger" | "pizzaz";
  text: string;
  iconName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  dataCy?: string;
  dataTestId?: string;
  role?: string;
}

export default function Button(props: IButtonProps) {
  // @ts-ignore
  const IconElement = Icons[props.iconName];
  let colorClasses = `${props.disabled ? "bg-indigo-200" : "bg-indigo-600 hover:bg-indigo-500"}  text-white`;
  switch (props.flavor) {
    case "secondary":
      colorClasses = "bg-white hover:bg-slate-200 text-black hover:text-black";
      break;
    case "danger":
      colorClasses = `${props.disabled ? "bg-red-200" : "bg-red-500 hover:bg-red-700"} text-white hover:text-white`;
      break;
    case "pizzaz":
      colorClasses = "bg-amber-400 hover:bg-amber-500 text-white hover:text-white";
      break;
  }
  return (
    <button
      role={props.role}
      data-cy={props.dataCy}
      data-testid={props.dataTestId}
      className={classNames(
        "flex flex-row justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        colorClasses,
        props.className,
      )}
      onClick={() => props.onClick && props.onClick()}
      type={props.type || "button"}
      disabled={props.disabled}
    >
      {IconElement && <IconElement className="mr-2 h-5 w-5" />}
      <span>{props.text}</span>
    </button>
  );
}
