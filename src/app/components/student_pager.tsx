"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IStudentPager {
  totalCount: number;
  pageSize: number;
}

export default function StudentPager(props: IStudentPager): JSX.Element {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = searchParams?.has("page") ? Number(searchParams?.get("page")) : 1;
  const range = [(currentPage - 1) * props.pageSize + 1, (currentPage - 1) * props.pageSize + props.pageSize];

  const handleIncPage = (direction: -1 | 1) => {
    handleChangePage(currentPage + direction);
  };

  const lastPage = Math.ceil(props.totalCount / props.pageSize);
  let pageNumbersToShow: Array<number>;
  if (currentPage <= 3) {
    pageNumbersToShow = [1, 2, 3, 4, 5].filter((n) => n <= lastPage);
  } else {
    const bottomNumber = currentPage - 3;
    pageNumbersToShow = Array(5)
      .fill(0)
      .map((_, i) => i + 1 + bottomNumber)
      .filter((pageNumber) => pageNumber <= lastPage);
    if (pageNumbersToShow.length < 5) {
      const numberOfPagesToPrepend = 5 - pageNumbersToShow.length;
      const minNumberToPrepend = pageNumbersToShow[0] - numberOfPagesToPrepend;
      const pageNumbersToPrepend = Array(numberOfPagesToPrepend)
        .fill(0)
        .map((_, i) => i + minNumberToPrepend);
      pageNumbersToShow = [...pageNumbersToPrepend, ...pageNumbersToShow];
    }
  }

  const handleChangePage = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (pageNumber > pageNumbersToShow[pageNumbersToShow.length - 1]) {
      return;
    }
    if (pageNumber > 1) {
      newParams.set("page", String(pageNumber));
    } else {
      newParams.delete("page");
    }
    replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="my-5 flex items-center justify-between">
      <div>
        Showing {range[0]} to {Math.min(range[1], props.totalCount)} of{" "}
        <span className="font-bold">{props.totalCount}</span>{" "}
        {searchParams.has("search") ? "results" : "total students"}
      </div>
      <div className="flex -space-x-px rounded-md">
        <div
          onClick={() => handleIncPage(-1)}
          className={classNames(
            "flex content-center items-center rounded-l-md bg-white p-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0",
            { "cursor-pointer": currentPage > 1 },
          )}
        >
          <ChevronLeftIcon width={20} height={20} />
        </div>
        {pageNumbersToShow.map((pageNumber: number, i) => (
          <div
            key={pageNumber}
            onClick={() => handleChangePage(pageNumber)}
            className={classNames(
              "page-number flex cursor-pointer content-center items-center p-1 px-3 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0",
              { "bg-white text-black hover:bg-gray-50": pageNumber !== currentPage },
              { "bg-blue-500 text-white hover:bg-blue-700": pageNumber === currentPage },
            )}
          >
            <span>{pageNumber}</span>
          </div>
        ))}
        <div
          onClick={() => handleIncPage(1)}
          className={classNames(
            "flex content-center items-center rounded-r-md bg-white p-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0",
            { "cursor-pointer": currentPage < pageNumbersToShow[pageNumbersToShow.length - 1] },
          )}
        >
          <ChevronRightIcon width={20} height={20} />
        </div>
      </div>
    </div>
  );
}
