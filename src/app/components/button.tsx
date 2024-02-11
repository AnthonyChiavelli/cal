"use client";

import Link from "next/link";
import * as Icons from "@heroicons/react/24/outline";
import { ITailwindIcon } from "../types";
import React from "react";

interface IButtonProps {
  href?: string;
  onClick?: () => void;
  style: "primary" | "secondary" | "warning";
  text: string;
  iconName?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button(props: IButtonProps) {
  // @ts-ignore
  const IconElement = Icons[props.iconName];
  const buttonClasses =
    "px-3 py-2 flex items-center bg-slate-400 hover:bg-slate-500 text-white hover:text-white rounded";
  if (props.href) {
    return (
      <Link className={buttonClasses} href={props.href} onClick={props.onClick}>
        {IconElement && <IconElement className="h-5 w-5 mr-2" />}
        <span>{props.text}</span>
      </Link>
    );
  } else {
    return (
      <button
        className={buttonClasses}
        onClick={() => props.onClick && props.onClick()}
        type={props.type || "button"}
        disabled={props.disabled}
      >
        {IconElement && <IconElement className="h-5 w-5 mr-2" />}
        <span>{props.text}</span>
      </button>
    );
  }
}
