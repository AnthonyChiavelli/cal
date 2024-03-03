/*
  Warnings:

  - You are about to drop the `Class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CLASS', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('PHONE', 'PERSON', 'EMAIL', 'ZOOM', 'FACEBOOK', 'OTHER');

-- DropForeignKey
ALTER TABLE "_ClassToStudent" DROP CONSTRAINT "_ClassToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToStudent" DROP CONSTRAINT "_ClassToStudent_B_fkey";

-- DropTable
DROP TABLE "Class";

-- DropTable
DROP TABLE "_ClassToStudent";

-- CreateTable
CREATE TABLE "Event" (
    "eventType" "EventType" NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "classType" "ClassType",
    "notes" TEXT,
    "parentName" TEXT,
    "studentName" TEXT,
    "referralSource" "ReferralSource",

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventStudent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "cancelledAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventStudent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventStudent" ADD CONSTRAINT "EventStudent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStudent" ADD CONSTRAINT "EventStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
