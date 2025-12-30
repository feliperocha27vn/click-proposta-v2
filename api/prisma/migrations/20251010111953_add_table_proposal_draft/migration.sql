-- CreateTable
CREATE TABLE "public"."proposal_drafts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "welcome_description" TEXT NOT NULL,
    "why_us" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "user_prompt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_drafts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."proposal_drafts" ADD CONSTRAINT "proposal_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."proposal_drafts" ADD CONSTRAINT "proposal_drafts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
