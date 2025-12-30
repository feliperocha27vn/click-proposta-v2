-- CreateTable
CREATE TABLE "public"."proposals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url_logo_image" TEXT,
    "title" TEXT NOT NULL,
    "customers_id" UUID NOT NULL,
    "welcome_description" TEXT,
    "why_us" TEXT,
    "challenge" TEXT,
    "solution" TEXT,
    "results" TEXT,
    "discount" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."proposal_services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "proposal_id" UUID NOT NULL,
    "services_id" UUID NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "proposal_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."proposals" ADD CONSTRAINT "proposals_customers_id_fkey" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_services" ADD CONSTRAINT "proposal_services_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "public"."proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_services" ADD CONSTRAINT "proposal_services_services_id_fkey" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
