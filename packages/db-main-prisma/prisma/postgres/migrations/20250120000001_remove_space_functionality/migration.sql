-- Remove space functionality and enforce single base per user

-- Drop foreign key constraints first
ALTER TABLE "invitation" DROP CONSTRAINT IF EXISTS "invitation_space_id_fkey";
ALTER TABLE "invitation_record" DROP CONSTRAINT IF EXISTS "invitation_record_space_id_fkey";

-- Remove space-related columns
ALTER TABLE "invitation" DROP COLUMN IF EXISTS "space_id";
ALTER TABLE "invitation_record" DROP COLUMN IF EXISTS "space_id";
ALTER TABLE "access_token" DROP COLUMN IF EXISTS "space_ids";

-- Remove space-related settings
ALTER TABLE "setting" DROP COLUMN IF EXISTS "disallow_space_creation";
ALTER TABLE "setting" DROP COLUMN IF EXISTS "disallow_space_invitation";

-- Drop the space table
DROP TABLE IF EXISTS "space";
