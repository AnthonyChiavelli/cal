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
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <main className="main max-h-screen overflow-hidden flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <Header userName={props.userName ?? "unknown"} handleClickExpandSidebar={() => setSidebarExpanded(true)} />
        <div className="min-h-0 flex flex-col flex-grow p-4 overflow-y-auto">{props.children}</div>
      </main>
    </div>
  );
}
