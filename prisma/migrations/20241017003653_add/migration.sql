/*
  Warnings:

  - Added the required column `name` to the `AreaOfNeed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AreaOfNeed" ADD COLUMN     "name" TEXT NOT NULL;
