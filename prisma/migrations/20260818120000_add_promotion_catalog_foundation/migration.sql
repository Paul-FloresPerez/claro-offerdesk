-- CreateEnum
CREATE TYPE "PromotionKind" AS ENUM ('CAMPAIGN', 'REGULAR_OFFER');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PromotionAssetKind" AS ENUM (
    'FLYER',
    'COVERAGE',
    'OFFICIAL_TABLE',
    'OFFICIAL_DOCUMENT',
    'INTERNAL'
);

-- CreateEnum
CREATE TYPE "PromotionAssetVisibility" AS ENUM (
    'SHAREABLE',
    'AUTHENTICATED',
    'ADMIN_ONLY'
);

-- CreateTable
CREATE TABLE "promotion_catalog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "legacy_id" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT,
    "kind" "PromotionKind" NOT NULL DEFAULT 'CAMPAIGN',
    "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
    "category" TEXT,
    "tags" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMPTZ(6),
    "valid_until" TIMESTAMPTZ(6),
    "technologies" JSONB,
    "play_types" JSONB,
    "zone_summary" TEXT,
    "benefits" JSONB,
    "conditions" JSONB,
    "validations" JSONB,
    "commercial_text" TEXT,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_catalog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "promotion_catalog_slug_check" CHECK (
        "slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),
    CONSTRAINT "promotion_catalog_validity_check" CHECK (
        "valid_from" IS NULL
        OR "valid_until" IS NULL
        OR "valid_until" >= "valid_from"
    )
);

-- CreateTable
CREATE TABLE "promotion_assets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "promotion_id" UUID NOT NULL,
    "kind" "PromotionAssetKind" NOT NULL,
    "visibility" "PromotionAssetVisibility" NOT NULL,
    "display_name" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_url" TEXT,
    "mime_type" TEXT NOT NULL,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "size_bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "checksum" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotion_assets_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "promotion_assets_display_name_check" CHECK (
        NULLIF(BTRIM("display_name"), '') IS NOT NULL
    ),
    CONSTRAINT "promotion_assets_mime_type_check" CHECK (
        "mime_type" IN (
            'image/png',
            'image/jpeg',
            'image/webp',
            'application/pdf'
        )
    ),
    CONSTRAINT "promotion_assets_kind_mime_check" CHECK (
        (
            "kind" = 'OFFICIAL_DOCUMENT'::"PromotionAssetKind"
            AND "mime_type" = 'application/pdf'
        )
        OR
        (
            "kind" IN (
                'FLYER'::"PromotionAssetKind",
                'COVERAGE'::"PromotionAssetKind"
            )
            AND "mime_type" IN ('image/png', 'image/jpeg', 'image/webp')
        )
        OR "kind" IN (
            'OFFICIAL_TABLE'::"PromotionAssetKind",
            'INTERNAL'::"PromotionAssetKind"
        )
    ),
    CONSTRAINT "promotion_assets_file_url_visibility_check" CHECK (
        (
            "visibility" = 'SHAREABLE'::"PromotionAssetVisibility"
            AND "file_url" IS NOT NULL
            AND "file_url" ~ '^https://'
        )
        OR
        (
            "visibility" <> 'SHAREABLE'::"PromotionAssetVisibility"
            AND "file_url" IS NULL
        )
    ),
    CONSTRAINT "promotion_assets_dimensions_check" CHECK (
        ("size_bytes" IS NULL OR "size_bytes" >= 0)
        AND ("width" IS NULL OR "width" > 0)
        AND ("height" IS NULL OR "height" > 0)
    ),
    CONSTRAINT "promotion_assets_internal_visibility_check" CHECK (
        "kind" <> 'INTERNAL'::"PromotionAssetKind"
        OR "visibility" <> 'SHAREABLE'::"PromotionAssetVisibility"
    )
);

-- CreateIndex
CREATE UNIQUE INDEX "promotion_catalog_legacy_id_key"
ON "promotion_catalog"("legacy_id");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_catalog_slug_key"
ON "promotion_catalog"("slug");

-- CreateIndex
CREATE INDEX "promotion_catalog_status_sort_order_idx"
ON "promotion_catalog"("status", "sort_order");

-- CreateIndex
CREATE INDEX "promotion_catalog_category_status_idx"
ON "promotion_catalog"("category", "status");

-- CreateIndex
CREATE INDEX "promotion_catalog_featured_status_idx"
ON "promotion_catalog"("featured", "status");

-- CreateIndex
CREATE UNIQUE INDEX "promotion_assets_file_key_key"
ON "promotion_assets"("file_key");

-- CreateIndex
CREATE INDEX "promotion_assets_promotion_id_sort_order_idx"
ON "promotion_assets"("promotion_id", "sort_order");

-- AddForeignKey
ALTER TABLE "promotion_assets"
ADD CONSTRAINT "promotion_assets_promotion_id_fkey"
FOREIGN KEY ("promotion_id") REFERENCES "promotion_catalog"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
