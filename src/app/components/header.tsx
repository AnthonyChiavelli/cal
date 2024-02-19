import Link from "next/link";
import Image from "next/image";
import { getSession } from "@auth0/nextjs-auth0";
import Breadcrumbs from "./breadcrumbs";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="header bg-white shadow py-4 px-4">
      <div className="header-content flex items-center flex-row">
        <Breadcrumbs />
        <div className="flex ml-auto">
          <Link href="/app/profile" className="hidden tiny:flex flex-row items-center">
            <Image
              alt="Profile Image"
              src="https://lh3.googleusercontent.com/a/ACg8ocKF5DLHNFxfuglyUAYWeQ_Aq5VJ6G33z57A40oXlHtwYSU=s96-c"
              className="h-10 w-10 bg-gray-200 border rounded-full"
              width={10}
              height={10}
            />
            <span className="flex-col ml-2 hidden xs:flex">
              <span className="truncate font-semibold tracking-wide leading-none">
                {session?.user.name ?? "Unknown"}
              </span>
              <span className="truncate text-gray-500 text-xs leading-none mt-1">Admin</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
