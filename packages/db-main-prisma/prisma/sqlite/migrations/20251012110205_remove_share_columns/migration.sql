-- DropIndex
DROP INDEX IF EXISTS "view_enable_share_idx";

-- AlterTable
-- SQLite doesn't support DROP COLUMN IF EXISTS, so we'll skip dropping columns
-- as they may not exist in all databases
