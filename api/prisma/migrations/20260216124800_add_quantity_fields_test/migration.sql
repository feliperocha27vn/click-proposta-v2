-- AlterTable
ALTER TABLE "budgets_services" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
