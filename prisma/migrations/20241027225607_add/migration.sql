-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('CREATED', 'SENT', 'PARTIALLY_PAID', 'CLOSED');

-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'FORBEARANCE';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'SENT';
