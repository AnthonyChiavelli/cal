import { HandlerError, handleAuth } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const GET = handleAuth({
  onError: (req: NextRequest, error: HandlerError) => {
    console.error("🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵");
    console.error(error);
    console.error("🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵🌵");
    return redirect(`http://${req.nextUrl.host}/login-error-poop`);
  },
});
