-- DropForeignKey
ALTER TABLE "public"."proposal_services" DROP CONSTRAINT IF EXISTS "proposal_services_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."proposal_services" DROP CONSTRAINT IF EXISTS "proposal_services_services_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."proposal_services" ADD CONSTRAINT "proposal_services_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_services" ADD CONSTRAINT "proposal_services_services_id_fkey" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
