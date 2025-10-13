-- Migration to remove trash functionality
-- Drop trash tables and remove deleted_time columns

-- Drop trash tables
DROP TABLE IF EXISTS "trash";
DROP TABLE IF EXISTS "table_trash";
DROP TABLE IF EXISTS "record_trash";

-- Remove deleted_time columns from various tables
ALTER TABLE "base" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "table_meta" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "field" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "view" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "users" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "attachments" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "invitation" DROP COLUMN IF EXISTS "deleted_time";
ALTER TABLE "comment" DROP COLUMN IF EXISTS "deleted_time";
