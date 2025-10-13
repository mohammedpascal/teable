-- Add user_id column to base table
ALTER TABLE "base" ADD COLUMN "user_id" TEXT;

-- Populate user_id from created_by for existing bases
UPDATE "base" SET "user_id" = "created_by" WHERE "user_id" IS NULL;

-- Make user_id NOT NULL
ALTER TABLE "base" ALTER COLUMN "user_id" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "base" ADD CONSTRAINT "base_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add unique constraint on user_id to enforce single base per user
ALTER TABLE "base" ADD CONSTRAINT "base_user_id_unique" UNIQUE ("user_id");

-- Make space_id nullable (remove NOT NULL constraint)
ALTER TABLE "base" ALTER COLUMN "space_id" DROP NOT NULL;

-- Remove foreign key constraint to space (keep data but remove relation)
ALTER TABLE "base" DROP CONSTRAINT IF EXISTS "base_space_id_fkey";
