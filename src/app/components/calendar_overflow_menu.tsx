import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { createMonthString } from "@/util/calendar";

export default function CalenderOverflowMenu() {
  const menuTimes = [
    { name: "Create event", href: "/app/schedule/create" },
    {
      name: "Go to today",
      href: `?p=month&t=${createMonthString(new Date().getFullYear(), new Date().getMonth() + 1)}`,
    },
    { name: "Day view", href: "?p=day" },
    { name: "Month view", href: "?p=month" },
  ];
  return (
    <Menu as="div" className="relative ml-6 md:hidden">
      <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
        <span className="sr-only">Open menu</span>
        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {menuTimes.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <a
                    href={item.href}
                    className={classNames(
                      { "bg-gray-100 text-gray-900": active },
                      { "text-gray-700": !active },
                      "block px-4 py-2 text-sm",
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
