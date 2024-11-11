-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActionType" ADD VALUE 'CREATE_INVOICE';
ALTER TYPE "ActionType" ADD VALUE 'UPDATE_INVOICE';
ALTER TYPE "ActionType" ADD VALUE 'DELETE_INVOICE';
ALTER TYPE "ActionType" ADD VALUE 'CREATE_PAYMENT';
ALTER TYPE "ActionType" ADD VALUE 'UPDATE_PAYMENT';
ALTER TYPE "ActionType" ADD VALUE 'DELETE_PAYMENT';