-- DropIndex
DROP INDEX IF EXISTS "view_enable_share_idx";

-- AlterTable
ALTER TABLE "view" DROP COLUMN IF EXISTS "enable_share";
ALTER TABLE "view" DROP COLUMN IF EXISTS "share_id";
ALTER TABLE "view" DROP COLUMN IF EXISTS "share_meta";
