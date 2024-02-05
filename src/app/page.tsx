import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl mb-5">Welcome to Cal</h1>
      <Link className="border border-slate-200 rounded px-2 py-1" href="/students">
        Student List
      </Link>
      <Link className="border border-slate-200 rounded px-2 py-1" href="/calendar">
        Calendar
      </Link>
    </div>
  );
}
