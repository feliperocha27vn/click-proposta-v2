-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "credits" INTEGER DEFAULT 2;
