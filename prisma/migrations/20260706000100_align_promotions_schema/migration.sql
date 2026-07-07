CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'promotions'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'promotions'
        AND column_name = 'id'
        AND udt_name <> 'uuid'
    ) THEN
      ALTER TABLE "promotions" DROP CONSTRAINT IF EXISTS "promotions_pkey";
      ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "id_uuid" UUID DEFAULT gen_random_uuid();
      UPDATE "promotions" SET "id_uuid" = gen_random_uuid() WHERE "id_uuid" IS NULL;
      ALTER TABLE "promotions" DROP COLUMN "id";
      ALTER TABLE "promotions" RENAME COLUMN "id_uuid" TO "id";
      ALTER TABLE "promotions" ALTER COLUMN "id" SET NOT NULL;
      ALTER TABLE "promotions" ADD CONSTRAINT "promotions_pkey" PRIMARY KEY ("id");
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'promotions'
        AND column_name = 'benefits'
        AND udt_name <> 'jsonb'
    ) THEN
      ALTER TABLE "promotions" ALTER COLUMN "benefits" DROP DEFAULT;
      ALTER TABLE "promotions" ALTER COLUMN "benefits" TYPE JSONB USING to_jsonb("benefits");
    END IF;

    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'promotions'
        AND column_name = 'conditions'
        AND udt_name <> 'jsonb'
    ) THEN
      ALTER TABLE "promotions" ALTER COLUMN "conditions" DROP DEFAULT;
      ALTER TABLE "promotions" ALTER COLUMN "conditions" TYPE JSONB USING to_jsonb("conditions");
    END IF;

    ALTER TABLE "promotions" ALTER COLUMN "category" DROP NOT NULL;
    ALTER TABLE "promotions" ALTER COLUMN "description" DROP NOT NULL;
    ALTER TABLE "promotions" ALTER COLUMN "price" DROP NOT NULL;
    ALTER TABLE "promotions" ALTER COLUMN "benefits" DROP NOT NULL;
    ALTER TABLE "promotions" ALTER COLUMN "conditions" DROP NOT NULL;
    ALTER TABLE "promotions" ALTER COLUMN "validity" DROP NOT NULL;
  END IF;
END $$;
