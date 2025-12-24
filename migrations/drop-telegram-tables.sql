-- Migration: Remove unused Telegram tables
-- These tables are archived and no longer used (see ARCHIVED_CODE_v1.0.md)
-- Using CASCADE to handle any foreign key constraints

DROP TABLE IF EXISTS telegram_conversations CASCADE;
DROP TABLE IF EXISTS telegram_user_profiles CASCADE;
