-- CreateTable
CREATE TABLE "public"."budgets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "status" "public"."status" NOT NULL DEFAULT 'DRAFT',
    "customers_id" UUID NOT NULL,
    "users_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."budgets_services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budgets_id" UUID NOT NULL,

    CONSTRAINT "budgets_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."budgets" ADD CONSTRAINT "budgets_customers_id_fkey" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."budgets" ADD CONSTRAINT "budgets_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."budgets_services" ADD CONSTRAINT "budgets_services_budgets_id_fkey" FOREIGN KEY ("budgets_id") REFERENCES "public"."budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
