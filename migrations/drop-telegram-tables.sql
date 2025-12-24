-- Migration: Remove unused Telegram tables
-- These tables are archived and no longer used (see ARCHIVED_CODE_v1.0.md)

DROP TABLE IF EXISTS telegram_conversations;
DROP TABLE IF EXISTS telegram_user_profiles;
