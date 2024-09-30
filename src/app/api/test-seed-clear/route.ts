import { env } from "process";
import prisma from "@/db";

export const dynamic = "force-dynamic";

export const POST = async (request: any) => {
  const bearerToken = request.headers.get("authorization");
  if (bearerToken !== env.CYPRESS_API_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({
    where: {
      email: env.AUTH0_USERNAME,
    },
  });
  await prisma.student.deleteMany({
    where: {
      ownerId: env.AUTH0_USERNAME,
    },
  });
  await prisma.event.deleteMany({
    where: {
      ownerId: env.AUTH0_USERNAME,
    },
  });
  return Response.json({});
};
