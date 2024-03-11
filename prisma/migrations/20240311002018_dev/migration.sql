/*
  Warnings:

  - Made the column `classType` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "classType" SET NOT NULL,
ALTER COLUMN "classType" SET DEFAULT 'PRIVATE';
