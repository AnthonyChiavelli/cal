"use client";
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/16/solid";
import ProductLogo from "./product_logo";
import SidebarEntry from "./sidebar_entry";
import classNames from "classnames";
import { useState } from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={classNames(
        "z-50 sidebar shrink-0 w-64 md:shadow transform md:translate-x-0 transition-transform duration-150 ease-in bg-slate-500",
        {
          "translate-x-0": expanded,
          "-translate-x-60": !expanded,
        },
      )}
    >
      {!expanded && (
        <ChevronRightIcon className="block md:hidden h-6 w-6 text-gray-300 absolute right-0 top-1/2 -mr-1" />
      )}

      {!expanded && (
        <div
          onClick={() => setExpanded(true)}
          className="blocl md:hidden click-zone w-5 absolute top-0 right-0 bottom-0 z-10 cursor-pointer"
        />
      )}

      <div className="sidebar-header px-4 py-4">
        <ProductLogo />
      </div>

      <div className="sidebar-content px-4 py-6">
        <ul
          className={classNames("flex flex-col w-full items-stretch md:visible", {
            visible: expanded,
            invisible: !expanded,
          })}
        >
          <SidebarEntry icon={HomeIcon} text="Home" href="/app" highlighted={false} />
          <li className="my-px">
            <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">Pages</span>
          </li>
          <SidebarEntry icon={CalendarDaysIcon} text="Schedule" href="/app/schedule" highlighted={false} />
          <SidebarEntry icon={UsersIcon} text="Students" href="/app/students" highlighted={false} />
          <SidebarEntry icon={DocumentDuplicateIcon} text="Invoices" href="/app/invoices" highlighted={false} />
          <SidebarEntry icon={UserGroupIcon} text="Families" href="/app/families" highlighted={false} />
          <SidebarEntry icon={ChartBarIcon} text="Analytics" href="/app/analytics" highlighted={false} />
          <SidebarEntry icon={DocumentTextIcon} text="Logs" href="/app/logs" highlighted={false} />
          <li className="my-px">
            <span className="flex font-medium text-sm text-gray-300 px-4 my-4 uppercase">Account</span>
          </li>
          <SidebarEntry icon={UserIcon} text="Profile" href="/app/profile" highlighted={false} />
          <SidebarEntry icon={Cog6ToothIcon} text="Settings" href="/app/settings" highlighted={false} />
          <SidebarEntry
            icon={ArrowLeftStartOnRectangleIcon}
            text="Logout"
            href="/api/auth/logout"
            highlighted={false}
          />

          <li className="my-px absolute bottom-3 left-0 right-0 block md:hidden" onClick={() => setExpanded(false)}>
            <div
              className={classNames(
                "flex flex-row items-center justify-center h-10 px-3 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700",
              )}
            >
              <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-300" />
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
}
