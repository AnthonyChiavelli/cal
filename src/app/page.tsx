import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Button from "./components/button";
import HomeNavBar from "./components/home_page/nav_bar";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center">
      <HomeNavBar />
      <h1 className="mb-5 text-2xl">Welcome to Cal</h1>
      {session?.user ? (
        <Link href="/app">
          <Button flavor="pizzaz" text="Go to app" />
        </Link>
      ) : (
        <Link href={`/api/auth/login?returnTo=${encodeURIComponent("/app")}`}>
          <Button flavor="pizzaz" text="Log in" />
        </Link>
      )}
    </div>
  );
}
