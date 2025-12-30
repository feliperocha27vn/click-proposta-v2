/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "is_register_complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "public"."users"("cpf");
