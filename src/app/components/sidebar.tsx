import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/16/solid";
import Header from "./header";
import ProductLogo from "./product_logo";
import SidebarEntry from "./sidebar_entry";

interface ISidebarProps {
  children: React.ReactNode;
}

export default function Sidebar(props: ISidebarProps) {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <aside className="sidebar shrink-0 w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-slate-500">
        <div className="sidebar-header px-4 py-4">
          <ProductLogo />
        </div>
        <div className="sidebar-content px-4 py-6">
          <ul className="flex flex-col w-full">
            <SidebarEntry icon={HomeIcon} text="Home" href="/app" highlighted={false} />
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">Pages</span>
            </li>
            <SidebarEntry icon={CalendarDaysIcon} text="Schedule" href="/app/schedule" highlighted={false} />
            <SidebarEntry icon={UsersIcon} text="Students" href="/app/students" highlighted={false} />
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">Account</span>
            </li>
            <SidebarEntry icon={UserIcon} text="Profile" href="/app/profile" highlighted={false} />
            <SidebarEntry icon={Cog6ToothIcon} text="Account" href="/app/account" highlighted={false} />
            <SidebarEntry
              icon={ArrowLeftStartOnRectangleIcon}
              text="Logout"
              href="/api/auth/logout"
              highlighted={false}
            />
          </ul>
        </div>
      </aside>
      <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <Header />
        <div className="main-content flex flex-col flex-grow p-4">{props.children}</div>
      </main>
    </div>
  );
}
