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
  BeakerIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/16/solid";
import classNames from "classnames";
import ProductLogo from "./product_logo";
import SidebarEntry from "./sidebar_entry";

interface ISidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function Sidebar(props: ISidebarProps) {
  return (
    <>
      {props.expanded && (
        <div
          onClick={() => props.setExpanded(false)}
          className="overlay-zone fixed bottom-0 left-60 right-0 top-0 z-10 block bg-transparent md:hidden"
        />
      )}
      <aside
        className={classNames(
          "sidebar z-30 w-64 shrink-0 transform bg-gradient-45 from-azure to-hot-pink text-white transition-transform duration-150 ease-in md:translate-x-0 md:shadow",
          {
            "translate-x-0": props.expanded,
            "-translate-x-64": !props.expanded,
          },
        )}
      >
        <div className="sidebar-header px-4 py-4">
          <ProductLogo />
        </div>

        <div className="sidebar-content px-4 py-6">
          <ul
            onClick={() => props.setExpanded(false)}
            className={classNames("flex w-full flex-col items-stretch md:visible", {
              visible: props.expanded,
              invisible: !props.expanded,
            })}
          >
            <SidebarEntry icon={HomeIcon} text="Home" href="/app" highlighted={false} />
            <li className="my-px">
              <span className="my-4 flex px-4 text-sm font-medium uppercase text-gray-100">Pages</span>
            </li>
            <SidebarEntry icon={CalendarDaysIcon} text="Schedule" href="/app/schedule" highlighted={false} />
            <SidebarEntry icon={UsersIcon} text="Students" href="/app/students" highlighted={false} />
            <SidebarEntry icon={DocumentDuplicateIcon} text="Invoices" href="/app/invoices" highlighted={false} />
            <SidebarEntry icon={UserGroupIcon} text="Families" href="/app/families" highlighted={false} />
            <SidebarEntry icon={BeakerIcon} text="Areas Of Need" href="/app/areas-of-need" highlighted={false} />
            <SidebarEntry icon={ChartBarIcon} text="Analytics" href="/app/analytics" highlighted={false} />
            <SidebarEntry icon={DocumentTextIcon} text="Logs" href="/app/logs" highlighted={false} />
            <li className="my-px">
              <span className="my-4 flex px-4 text-sm font-medium uppercase text-gray-100">Account</span>
            </li>
            <SidebarEntry icon={UserIcon} text="Profile" href="/app/profile" highlighted={false} />
            <SidebarEntry icon={Cog6ToothIcon} text="Settings" href="/app/settings" highlighted={false} />
            <SidebarEntry
              icon={ArrowLeftStartOnRectangleIcon}
              text="Logout"
              href="/api/auth/logout"
              highlighted={false}
            />

            <li
              className="absolute bottom-3 left-0 right-0 my-px block md:hidden"
              onClick={() => props.setExpanded(false)}
            >
              <div
                className={classNames(
                  "flex h-10 flex-row items-center justify-center rounded-lg px-3 text-gray-300 hover:bg-gray-100 hover:text-gray-700",
                )}
              >
                <ChevronDoubleLeftIcon className="h-6 w-6 text-gray-300" />
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
