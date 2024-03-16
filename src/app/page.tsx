import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Button from "./components/button";
import HomeNavBar from "./components/home_page/nav_bar";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen">
      <HomeNavBar />
      <h1 className="text-2xl mb-5">Welcome to Cal</h1>
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
