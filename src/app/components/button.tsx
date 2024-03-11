"use client";

import React from "react";
import * as Icons from "@heroicons/react/24/outline";
import classNames from "classnames";

interface IButtonProps {
  onClick?: () => void;
  flavor: "primary" | "secondary" | "danger" | "pizzaz";
  text: string;
  iconName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button(props: IButtonProps) {
  // @ts-ignore
  const IconElement = Icons[props.iconName];
  let colorClasses = "bg-slate-400 hover:bg-slate-500 text-white hover:text-white";
  switch (props.flavor) {
    case "secondary":
      colorClasses = "bg-white hover:bg-slate-200 text-black hover:text-black";
      break;
    case "danger":
      colorClasses = "bg-red-500 hover:bg-red-700 text-white hover:text-white";
      break;
    case "pizzaz":
      colorClasses = "bg-rose-400 hover:bg-rose-500 text-white hover:text-white";
      break;
  }
  return (
    <button
      className={classNames("px-3 py-2 flex items-center rounded", colorClasses)}
      onClick={() => props.onClick && props.onClick()}
      type={props.type || "button"}
      disabled={props.disabled}
    >
      {IconElement && <IconElement className="h-5 w-5 mr-2" />}
      <span>{props.text}</span>
    </button>
  );
}
