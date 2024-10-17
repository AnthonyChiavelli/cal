import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

export async function getAreasOfNeed() {
  const { user } = await getSessionOrFail();
  return prisma.areaOfNeed.findMany({ orderBy: { createdAt: "desc" }, where: { ownerId: user.email } });
}
