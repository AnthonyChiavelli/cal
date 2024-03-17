import { getSessionOrFail } from "@/app/actions";
import prisma from "@/db";

export async function getActionRecords() {
  const { user } = await getSessionOrFail();
  return prisma.actionRecord.findMany({ orderBy: { createdAt: "desc" }, where: { ownerId: user.email } });
}
