import Button from "../components/button";
import Link from "next/link";

export default function AuthorizationError() {
  return (
    <div className="flex h-dvh w-screen flex-col items-center justify-center">
      <h1 className="mb-3 text-2xl">Oops! There was an error authorizing this action</h1>
      <p>If you beleive this is a mistake, please contact support or try again.</p>
      <Link className="mt-7" href="/">
        <Button flavor="primary" text="Go home" />
      </Link>
    </div>
  );
}
