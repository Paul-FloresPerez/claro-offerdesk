-- Add the multi-branch foundation without removing legacy authorization or branch fields.
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERVISOR', 'ADVISOR');

CREATE TABLE "branches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "users"
ADD COLUMN "role" "UserRole",
ADD COLUMN "branch_id" UUID;

-- Preserve existing access semantics while role becomes the new source of truth.
UPDATE "users"
SET "role" = CASE
    WHEN "is_admin" = true THEN 'ADMIN'::"UserRole"
    ELSE 'ADVISOR'::"UserRole"
END
WHERE "role" IS NULL;

CREATE UNIQUE INDEX "branches_name_key" ON "branches"("name");
CREATE INDEX "users_branch_id_role_is_active_idx"
ON "users"("branch_id", "role", "is_active");

ALTER TABLE "users"
ADD CONSTRAINT "users_branch_id_fkey"
FOREIGN KEY ("branch_id") REFERENCES "branches"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
