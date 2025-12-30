/*
  Warnings:

  - Added the required column `user_id` to the `proposals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."proposals" ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."proposals" ADD CONSTRAINT "proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
