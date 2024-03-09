-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE_STUDENT', 'EDIT_STUDENT', 'DELETE_STUDENT', 'IMPORT_STUDENTS', 'SCHEDULE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT');

-- CreateTable
CREATE TABLE "ActionRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" "ActionType" NOT NULL,
    "additionalData" JSONB NOT NULL,

    CONSTRAINT "ActionRecord_pkey" PRIMARY KEY ("id")
);
