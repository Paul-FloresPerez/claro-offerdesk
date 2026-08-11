-- Add an explicit Home selection without changing existing media records.
ALTER TABLE "training_media"
ADD COLUMN "is_featured" BOOLEAN NOT NULL DEFAULT false;
