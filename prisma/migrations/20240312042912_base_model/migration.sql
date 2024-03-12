-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CLASS', 'CONSULTATION');

-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('PRIVATE', 'GROUP');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('PHONE', 'PERSON', 'EMAIL', 'ZOOM', 'FACEBOOK', 'OTHER');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE_STUDENT', 'EDIT_STUDENT', 'DELETE_STUDENT', 'IMPORT_STUDENTS', 'SCHEDULE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT');

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userEmail" TEXT NOT NULL,
    "basePrice" MONEY NOT NULL,
    "showInlineDayCalendarInMobileView" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "familyId" TEXT,
    "gradeLevel" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaOfNeed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaOfNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventType" "EventType" NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "classType" "ClassType" NOT NULL DEFAULT 'PRIVATE',
    "notes" TEXT,
    "parentName" TEXT,
    "studentName" TEXT,
    "referralSource" "ReferralSource",
    "completed" BOOLEAN NOT NULL DEFAULT false,

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
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "EventStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" MONEY NOT NULL,
    "paidAmount" MONEY NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "sent" BOOLEAN NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyName" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "balance" MONEY NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "isPrimary" BOOLEAN NOT NULL,
    "familyId" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" "ActionType" NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "additionalData" JSONB NOT NULL,

    CONSTRAINT "ActionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreaOfNeedToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userEmail_key" ON "UserSettings"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaOfNeedToStudent_AB_unique" ON "_AreaOfNeedToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaOfNeedToStudent_B_index" ON "_AreaOfNeedToStudent"("B");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStudent" ADD CONSTRAINT "EventStudent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStudent" ADD CONSTRAINT "EventStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaOfNeedToStudent" ADD CONSTRAINT "_AreaOfNeedToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "AreaOfNeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaOfNeedToStudent" ADD CONSTRAINT "_AreaOfNeedToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
