-- Add outcome metrics without removing the legacy rank_position column.
ALTER TABLE "sales_ranking"
ADD COLUMN "pending_sales" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "rejected_sales" INTEGER NOT NULL DEFAULT 0;
