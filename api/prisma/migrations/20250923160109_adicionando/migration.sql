-- CreateEnum
CREATE TYPE "public"."status" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."proposals" ADD COLUMN "status" "public"."status" NOT NULL DEFAULT 'DRAFT';
