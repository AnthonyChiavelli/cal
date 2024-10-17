/*
  Warnings:

  - The values [EDIT_STUDENT] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('CREATE_STUDENT', 'UPDATE_STUDENT', 'DELETE_STUDENT', 'IMPORT_STUDENTS', 'CREATE_FAMILY', 'UPDATE_FAMILY', 'DELETE_FAMILY', 'SCHEDULE_EVENT', 'EDIT_EVENT', 'DELETE_EVENT', 'CANCEL_EVENT', 'MARK_COMPLETE_EVENT', 'CREATE_RECURRING_EVENT');
ALTER TABLE "ActionRecord" ALTER COLUMN "actionType" TYPE "ActionType_new" USING ("actionType"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;
