"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function StudentSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = React.useState(searchParams.get("search")?.toString());

  const handleUpdateSearch = (search: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set("search", search);
      setSearch(search);
    } else {
      newParams.delete("search");
      setSearch("");
    }

    replace(`${pathname}?${newParams.toString()}`);
  };

  const handleClearSearch = () => {
    handleUpdateSearch("");
  };

  return (
    <div className="relative mt-2 rounded-md shadow-sm">
      <input
        className="block w-full rounded-md border-0 py-1.5 pr-10 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
        type="text"
        onChange={(e) => handleUpdateSearch(e.target.value)}
        placeholder="Search students"
        value={search}
      />
      {searchParams.get("search")?.toString().length && (
        <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3" onClick={handleClearSearch}>
          <XMarkIcon className="h-5 w-5 text-black" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
