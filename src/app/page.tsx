import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen">
      <h1 className="text-2xl mb-5">Welcome to Cal</h1>
      {session?.user || true ? (
        <Link className="border border-slate-200 rounded px-2 py-1" href="/app">
          Go to app
        </Link>
      ) : (
        <Link
          className="border border-slate-200 rounded px-2 py-1"
          href={`/api/auth/login?returnTo=${encodeURIComponent("/app")}`}
        >
          Login
        </Link>
      )}
    </div>
  );
}
