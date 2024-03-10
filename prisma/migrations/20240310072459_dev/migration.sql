/*
  Warnings:

  - Added the required column `familyName` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "familyName" TEXT NOT NULL;
