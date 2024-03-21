import { env } from "process";

export const dynamic = "force-dynamic";

const mockData = {
  students: [
    {
      name: "TestStudent1",
    },
    {
      name: "TestStudent2",
    },
    {
      name: "TestStudent3",
    },
    {
      name: "TestStudent4",
    },
  ],
};

export const POST = async (request: any) => {
  const bearerToken = request.headers.get("authorization");
  if (bearerToken !== env.CYPRESS_API_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json({ mockData });
};
