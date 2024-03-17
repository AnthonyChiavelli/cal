import Button from "../components/button";
import Link from "next/link";

export default function AuthorizationError() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen">
      <h1 className="text-2xl mb-3">Oops! There was an error authorizing this action</h1>
      <p>If you beleive this is a mistake, please contact support or try again.</p>
      <Link className="mt-7" href="/">
        <Button flavor="primary" text="Go home" />
      </Link>
    </div>
  );
}
