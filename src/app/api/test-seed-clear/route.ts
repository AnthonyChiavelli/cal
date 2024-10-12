import { env } from "process";
import { clearAllSeedData } from "@/util/db";

export const dynamic = "force-dynamic";

export const POST = async (request: any) => {
  const bearerToken = request.headers.get("authorization");
  if (bearerToken !== env.CYPRESS_API_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  await clearAllSeedData();

  return Response.json({});
};
