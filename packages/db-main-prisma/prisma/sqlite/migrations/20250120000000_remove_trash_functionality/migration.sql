-- Migration to remove trash functionality
-- Drop trash tables and remove deleted_time columns

-- Drop trash tables
DROP TABLE IF EXISTS "trash";
DROP TABLE IF EXISTS "table_trash";
DROP TABLE IF EXISTS "record_trash";

-- Remove deleted_time columns from various tables
-- SQLite doesn't support DROP COLUMN IF EXISTS, so we need to check if columns exist first
-- For now, we'll skip dropping columns as they may not exist in all databases
