-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDIENTE', 'INSTALADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "advisor_id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "registered_by_id" UUID NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_dni" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_email" TEXT,
    "customer_address" TEXT,
    "service" TEXT NOT NULL,
    "plan_name" TEXT,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDIENTE',
    "rejection_reason" TEXT,
    "sale_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sales_rejection_reason_status_check" CHECK (
        (
            "status" = 'RECHAZADA'::"SaleStatus"
            AND NULLIF(BTRIM("rejection_reason"), '') IS NOT NULL
        )
        OR
        (
            "status" <> 'RECHAZADA'::"SaleStatus"
            AND "rejection_reason" IS NULL
        )
    )
);

-- CreateIndex
CREATE INDEX "sales_advisor_id_status_sale_date_idx"
ON "sales"("advisor_id", "status", "sale_date" DESC);

-- CreateIndex
CREATE INDEX "sales_branch_id_status_sale_date_idx"
ON "sales"("branch_id", "status", "sale_date" DESC);

-- CreateIndex
CREATE INDEX "sales_status_sale_date_idx"
ON "sales"("status", "sale_date" DESC);

-- AddForeignKey
ALTER TABLE "sales"
ADD CONSTRAINT "sales_advisor_id_fkey"
FOREIGN KEY ("advisor_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"
ADD CONSTRAINT "sales_branch_id_fkey"
FOREIGN KEY ("branch_id") REFERENCES "branches"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales"
ADD CONSTRAINT "sales_registered_by_id_fkey"
FOREIGN KEY ("registered_by_id") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
