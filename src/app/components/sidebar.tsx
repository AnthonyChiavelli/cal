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
          className="block md:hidden overlay-zone fixed left-60 right-0 bottom-0 top-0 z-10 bg-transparent"
        />
      )}
      <aside
        className={classNames(
          "z-30 sidebar shrink-0 w-64 md:shadow transform md:translate-x-0 transition-transform duration-150 ease-in text-white bg-gradient-45 from-azure to-hot-pink",
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
            className={classNames("flex flex-col w-full items-stretch md:visible", {
              visible: props.expanded,
              invisible: !props.expanded,
            })}
          >
            <SidebarEntry icon={HomeIcon} text="Home" href="/app" highlighted={false} />
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-100 px-4 my-4 uppercase">Pages</span>
            </li>
            <SidebarEntry icon={CalendarDaysIcon} text="Schedule" href="/app/schedule" highlighted={false} />
            <SidebarEntry icon={UsersIcon} text="Students" href="/app/students" highlighted={false} />
            <SidebarEntry icon={DocumentDuplicateIcon} text="Invoices" href="/app/invoices" highlighted={false} />
            <SidebarEntry icon={UserGroupIcon} text="Families" href="/app/families" highlighted={false} />
            <SidebarEntry icon={BeakerIcon} text="Areas Of Need" href="/app/areas-of-need" highlighted={false} />
            <SidebarEntry icon={ChartBarIcon} text="Analytics" href="/app/analytics" highlighted={false} />
            <SidebarEntry icon={DocumentTextIcon} text="Logs" href="/app/logs" highlighted={false} />
            <li className="my-px">
              <span className="flex font-medium text-sm text-gray-100 px-4 my-4 uppercase">Account</span>
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
              className="my-px absolute bottom-3 left-0 right-0 block md:hidden"
              onClick={() => props.setExpanded(false)}
            >
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
    </>
  );
}
