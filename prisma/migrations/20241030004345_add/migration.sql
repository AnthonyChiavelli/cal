-- AlterTable
ALTER TABLE "EventStudent" ADD COLUMN     "invoiceId" INTEGER;

-- AddForeignKey
ALTER TABLE "EventStudent" ADD CONSTRAINT "EventStudent_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
