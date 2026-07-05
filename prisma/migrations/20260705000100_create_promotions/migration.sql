CREATE TABLE IF NOT EXISTS "promotions" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "benefits" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "conditions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "validity" TEXT NOT NULL,
  "image_url" TEXT,
  "file_key" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'material-oficial',
  "detail_price" TEXT,
  "speed" TEXT,
  "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "applies_to" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "restrictions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "validations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sales_phrase" TEXT,
  "city_image_url" TEXT,
  "additional_media" JSONB,
  "variants" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "promotions_slug_key" ON "promotions"("slug");
CREATE INDEX IF NOT EXISTS "promotions_is_active_sort_order_idx" ON "promotions"("is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "promotions_category_idx" ON "promotions"("category");
