"use client";

import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").slice(1);

  const getHref = (pathsIndex: number) => {
    const pathElements = paths.slice(0, pathsIndex + 1);
    return "/" + pathElements.join("/");
  };

  return (
    <div className="flex flex-row items-center">
      {paths.map((path, i) => {
        const elements = [];
        if (path === "app")
          elements.push(
            <Link className="text-slate-700" key="home" href="/app">
              <HomeIcon width={20} height={20} />
            </Link>,
          );
        else
          elements.push(
            i < paths.length - 1 ? (
              <Link key={path} href={getHref(i)}>
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </Link>
            ) : (
              <span key={path}>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
            ),
          );
        if (i < paths.length - 1)
          elements.push(<ChevronRightIcon className="mx-2" key={path + "c"} width={15} height={15} />);
        return elements;
      })}
    </div>
  );
}
