-- DropIndex
DROP INDEX IF EXISTS "view_enable_share_idx";

-- AlterTable
ALTER TABLE "view" DROP COLUMN IF EXISTS "enable_share",
DROP COLUMN IF EXISTS "share_id",
DROP COLUMN IF EXISTS "share_meta";
