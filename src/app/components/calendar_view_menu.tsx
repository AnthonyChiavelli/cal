import { Fragment } from "react";
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

interface ICalendarViewMenuProps {
  timePeriod: string;
}

export default function CalendarViewMenu(props: ICalendarViewMenuProps) {
  const menuTimes = [
    { name: "Day view", href: "?p=day" },
    { name: "Week view", href: "?p=week" },
    { name: "Month view", href: "?p=month" },
  ];

  const displayText = () => {
    switch (props.timePeriod) {
      case "day":
        return "Day view";
      case "week":
        return "Week view";
      case "month":
        return "Month view";
      default:
        return "Month view";
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        type="button"
        className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {displayText()}
        <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
