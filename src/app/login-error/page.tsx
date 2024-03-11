import Button from "../components/button";
import Link from "next/link";

export default function LoginError() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen">
      <h1 className="text-2xl mb-3">Oops! There was an error logging you in</h1>
      <p>Your user was not found, please contact support or try again.</p>
      <Link className="mt-7" href="/">
        <Button flavor="pizzaz" text="Go home" />
      </Link>
    </div>
  );
}
