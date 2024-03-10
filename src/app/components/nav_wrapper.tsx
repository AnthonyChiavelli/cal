import Header from "./header";
import Sidebar from "./sidebar";

interface ISidebarProps {
  children: React.ReactNode;
}

export default function NavWrapper(props: ISidebarProps) {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
      <Sidebar />
      <main className="main max-h-screen overflow-hidden flex flex-col flex-grow -ml-60 md:ml-0 transition-all duration-150 ease-in">
        <Header />
        <div className="min-h-0 flex flex-col flex-grow p-4">{props.children}</div>
      </main>
    </div>
  );
}
