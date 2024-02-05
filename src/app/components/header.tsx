import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header bg-white shadow py-4 px-4">
      <div className="header-content flex items-center flex-row">
        <form action="#" autoComplete="off">
          <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
          <div className="hidden md:flex relative">
            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              id="search"
              type="text"
              name="search"
              autoComplete="false"
              className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
              placeholder="Search..."
            />
          </div>
          <div className="flex md:hidden">
            <Link href="#" className="flex items-center justify-center h-10 w-10 border-transparent">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </form>
        <div className="flex ml-auto">
          <Link href="#" className="flex flex-row items-center">
            <Image
              alt="Profile Image"
              src="https://pbs.twimg.com/profile_images/378800000298815220/b567757616f720812125bfbac395ff54_normal.png"
              className="h-10 w-10 bg-gray-200 border rounded-full"
              width={10}
              height={10}
            />
            <span className="flex flex-col ml-2">
              <span className="truncate w-20 font-semibold tracking-wide leading-none">John Doe</span>
              <span className="truncate w-20 text-gray-500 text-xs leading-none mt-1">Manager</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
