import Button from "../components/button";
import Link from "next/link";

export default function LoginError() {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center">
      <h1 className="mb-3 text-2xl">Oops! There was an error logging you in</h1>
      <p>Your user was not found, please contact support or try again.</p>
      <Link className="mt-7" href="/">
        <Button flavor="pizzaz" text="Go home" />
      </Link>
    </div>
  );
}
