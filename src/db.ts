import { PrismaClient } from "@prisma/client";

const globalWithPrisma = global as unknown as {
  primsa: PrismaClient | undefined;
};
const prisma =
  globalWithPrisma.primsa ??
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalWithPrisma.primsa = prisma;
export default prisma;
