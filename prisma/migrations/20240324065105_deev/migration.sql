-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'CREATE_RECURRING_EVENT';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "recurrenceGroupId" TEXT;

-- CreateTable
CREATE TABLE "RecurrenceGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "RecurrenceGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_recurrenceGroupId_fkey" FOREIGN KEY ("recurrenceGroupId") REFERENCES "RecurrenceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurrenceGroup" ADD CONSTRAINT "RecurrenceGroup_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
