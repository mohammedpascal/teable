-- Add user_id column to base table
ALTER TABLE "base" ADD COLUMN "user_id" TEXT;

-- Populate user_id from created_by for existing bases
UPDATE "base" SET "user_id" = "created_by" WHERE "user_id" IS NULL;

-- SQLite doesn't support ALTER COLUMN operations
-- These constraints will be handled by the application layer
