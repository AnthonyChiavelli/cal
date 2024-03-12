// import prisma from "@/client";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import prisma from "@/db";

export async function getSessionOrFail() {
  "use server";
  const session = await getSession();
  if (!session) {
    return redirect("/app");
  }
  const user = await prisma.user.findFirst({ where: { email: session.user.email } });
  if (!user) {
    return redirect("/app");
  }
  return { session, user };
}
