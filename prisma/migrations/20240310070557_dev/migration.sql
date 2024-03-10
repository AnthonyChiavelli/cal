/*
  Warnings:

  - You are about to drop the column `clientId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClientToStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `balance` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `familyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToStudent" DROP CONSTRAINT "_ClientToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClientToStudent" DROP CONSTRAINT "_ClientToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "balance" MONEY NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "clientId",
ADD COLUMN     "familyId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "_ClientToStudent";

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "familyId" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
