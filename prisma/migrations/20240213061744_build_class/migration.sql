/*
  Warnings:

  - Added the required column `durationMinutes` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledFor` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "durationMinutes" INTEGER NOT NULL,
ADD COLUMN     "scheduledFor" TIMESTAMP(3) NOT NULL;
