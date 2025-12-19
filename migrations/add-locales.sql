-- Migration: Add 50 locales for international SEO
-- This migration adds 40 new locales to the existing 10

-- Step 1: Add new values to the locale enum
-- Note: PostgreSQL doesn't support easy enum modification, so we use ALTER TYPE ... ADD VALUE

-- Tier 2: Major European markets
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'it';   -- Italian
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'pt';   -- Portuguese
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'nl';   -- Dutch
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'pl';   -- Polish
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'uk';   -- Ukrainian

-- Tier 3: South Asian languages (17% of tourists)
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ta';   -- Tamil
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'te';   -- Telugu
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'bn';   -- Bengali
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'mr';   -- Marathi
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'gu';   -- Gujarati
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ml';   -- Malayalam
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'kn';   -- Kannada
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'pa';   -- Punjabi
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ur';   -- Urdu (Pakistan)
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'si';   -- Sinhala (Sri Lanka)
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ne';   -- Nepali

-- Tier 4: East & Southeast Asian
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'th';      -- Thai
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'vi';      -- Vietnamese
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'id';      -- Indonesian
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ms';      -- Malay
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'tl';      -- Tagalog (Filipino)
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'zh-TW';   -- Chinese Traditional

-- Tier 5: Middle East & Central Asia
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'fa';   -- Persian/Farsi
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'tr';   -- Turkish
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'he';   -- Hebrew
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'kk';   -- Kazakh
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'uz';   -- Uzbek
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'az';   -- Azerbaijani

-- Tier 6: Other European
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'cs';   -- Czech
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'el';   -- Greek
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'sv';   -- Swedish
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'no';   -- Norwegian
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'da';   -- Danish
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'fi';   -- Finnish
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'hu';   -- Hungarian
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'ro';   -- Romanian

-- Tier 7: African markets
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'sw';   -- Swahili
ALTER TYPE locale ADD VALUE IF NOT EXISTS 'am';   -- Amharic

-- Verify the enum values
-- SELECT enum_range(NULL::locale);
