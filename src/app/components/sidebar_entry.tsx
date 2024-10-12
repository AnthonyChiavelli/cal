import classNames from "classnames";
import Link from "next/link";

interface ISidebarEntry {
  icon: any;
  text: string;
  href: string;
  highlighted: boolean;
}

export default function SidebarEntry(props: ISidebarEntry) {
  const IconElement = props.icon;
  return (
    <li className="my-px">
      <Link
        href={props.href}
        className={classNames("flex flex-row items-center h-10 px-3 rounded-lg", {
          "bg-gray-100 text-gray-700": props.highlighted,
          "text-gray-100 hover:bg-gray-100 hover:text-gray-700": !props.highlighted,
        })}
      >
        <IconElement className="h-5 w-5" />
        <span className="ml-3" data-cy={`sidebar-link-${props.text}`}>
          {props.text}
        </span>
      </Link>
    </li>
  );
}
