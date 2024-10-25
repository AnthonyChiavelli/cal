"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "./breadcrumbs";

interface IHeaderProps {
  userName?: string;
  handleClickExpandSidebar: () => void;
}

export default function Header(props: IHeaderProps) {
  return (
    <header className="header bg-white px-4 py-4 shadow">
      <div className="header-content flex flex-row items-center overflow-y-auto">
        <Bars3Icon onClick={props.handleClickExpandSidebar} className="mr-5 block h-6 w-6 cursor-pointer md:hidden" />
        <Breadcrumbs />
        <div className="ml-auto flex">
          <Link href="/app/profile" className="hidden flex-row items-center tiny:flex">
            <Image
              alt="Profile Image"
              src="https://lh3.googleusercontent.com/a/ACg8ocKF5DLHNFxfuglyUAYWeQ_Aq5VJ6G33z57A40oXlHtwYSU=s96-c"
              className="h-10 w-10 rounded-full border bg-gray-200"
              width={10}
              height={10}
            />
            <span className="ml-2 hidden flex-col xs:flex">
              <span className="truncate font-semibold leading-none tracking-wide">{props.userName ?? "Unknown"}</span>
              <span className="mt-1 truncate text-xs leading-none text-gray-500">Admin</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
