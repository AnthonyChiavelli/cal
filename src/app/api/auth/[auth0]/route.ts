import { handleAuth } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export const GET = handleAuth({
  // @ts-ignore
  onError: (req) => {
    // @ts-ignore
    console.error(`${req.nextUrl.host}/login-error`);
    // @ts-ignore
    return redirect(`http://${req.nextUrl.host}/login-error`);
  },
});
