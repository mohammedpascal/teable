-- Remove space functionality and enforce single base per user

-- Remove space-related columns
-- SQLite doesn't support DROP COLUMN directly, so we need to recreate tables
-- First, create new tables without space columns

-- Recreate invitation table without space_id
CREATE TABLE "invitation_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "base_id" TEXT,
    "type" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "invitation_code" TEXT NOT NULL,
    "expired_time" DATETIME,
    "create_by" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "last_modified_by" TEXT
);

-- Copy data from old table
INSERT INTO "invitation_new" SELECT 
    "id", "base_id", "type", "role", "invitation_code", "expired_time", 
    "create_by", "created_time", "last_modified_time", "last_modified_by"
FROM "invitation";

-- Drop old table and rename new one
DROP TABLE "invitation";
ALTER TABLE "invitation_new" RENAME TO "invitation";

-- Recreate invitation_record table without space_id
CREATE TABLE "invitation_record_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitation_id" TEXT NOT NULL,
    "base_id" TEXT,
    "type" TEXT NOT NULL,
    "inviter" TEXT NOT NULL,
    "accepter" TEXT NOT NULL,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old table
INSERT INTO "invitation_record_new" SELECT 
    "id", "invitation_id", "base_id", "type", "inviter", "accepter", "created_time"
FROM "invitation_record";

-- Drop old table and rename new one
DROP TABLE "invitation_record";
ALTER TABLE "invitation_record_new" RENAME TO "invitation_record";

-- Recreate access_token table without space_ids
CREATE TABLE "access_token_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "base_ids" TEXT,
    "sign" TEXT NOT NULL,
    "client_id" TEXT,
    "expired_time" DATETIME NOT NULL,
    "last_used_time" DATETIME,
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    CONSTRAINT "access_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from old table
INSERT INTO "access_token_new" SELECT 
    "id", "name", "description", "user_id", "scopes", "base_ids", 
    "sign", "client_id", "expired_time", "last_used_time", "created_time", "last_modified_time"
FROM "access_token";

-- Drop old table and rename new one
DROP TABLE "access_token";
ALTER TABLE "access_token_new" RENAME TO "access_token";

-- Recreate setting table without space-related columns
CREATE TABLE "setting_new" (
    "instance_id" TEXT NOT NULL PRIMARY KEY,
    "disallow_sign_up" BOOLEAN,
    "enable_email_verification" BOOLEAN
);

-- Copy data from old table (excluding space columns)
INSERT INTO "setting_new" SELECT 
    "instance_id", "disallow_sign_up", "enable_email_verification"
FROM "setting";

-- Drop old table and rename new one
DROP TABLE "setting";
ALTER TABLE "setting_new" RENAME TO "setting";

-- Drop the space table
DROP TABLE IF EXISTS "space";
