"use client";

import { useState } from "react";
import { useOnMediaQueryMatch } from "@/util/hooks";
import Header from "./header";
import Sidebar from "./sidebar";

interface ISidebarProps {
  children: React.ReactNode;
  userName?: string;
}

export default function NavWrapper(props: ISidebarProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useOnMediaQueryMatch("768px", (m) => setSidebarExpanded(!m));

  return (
    <div className="flex min-h-screen flex-row bg-gray-100 text-gray-800">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <main className="main -ml-64 flex max-h-screen flex-grow flex-col overflow-hidden transition-all duration-150 ease-in md:ml-0">
        <Header userName={props.userName ?? "unknown"} handleClickExpandSidebar={() => setSidebarExpanded(true)} />
        <div className="flex min-h-0 flex-grow flex-col overflow-y-auto p-4">{props.children}</div>
      </main>
    </div>
  );
}
