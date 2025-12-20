/**
 * Translation API endpoint
 * POST /api/translate
 *
 * Uses GPT-4o-mini as PRIMARY (100x cheaper than DeepL Pro)
 * DeepL FREE tier available as optional fallback
 */

import { Router, Request, Response } from 'express';
import { translateText } from '../services/translation-service';
import type { Locale } from '@shared/schema';

const router = Router();

// Supported languages
const SUPPORTED_LANGUAGES = [
  'ar', 'ru', 'zh', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'ko', 'tr', 'nl',
  'hi', 'he', 'pl', 'uk', 'id', 'sv', 'da', 'fi', 'nb', 'el', 'cs', 'ro',
  'hu', 'sk', 'bg', 'lt', 'lv', 'sl', 'et'
];

interface TranslateRequest {
  text: string | string[];
  targetLang: string;
  provider?: 'gpt' | 'deepl_free_only';
}

/**
 * POST /api/translate
 * Body: { text: string | string[], targetLang: string, provider?: 'gpt' | 'deepl_free_only' }
 * Returns: { translations: string[] }
 *
 * COST INFO:
 * - GPT-4o-mini: ~$0.22 per million characters (DEFAULT)
 * - DeepL Free: $0 but 500K chars/month limit
 * - DeepL Pro: $25+/M chars (NEVER USED - too expensive!)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, targetLang, provider = 'gpt' } = req.body as TranslateRequest;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'text and targetLang are required' });
    }

    if (!SUPPORTED_LANGUAGES.includes(targetLang)) {
      return res.status(400).json({
        error: `Language ${targetLang} not supported`,
        supported: SUPPORTED_LANGUAGES
      });
    }

    const texts = Array.isArray(text) ? text : [text];

    // Translate all texts using the translation service
    // Default is GPT-4o-mini which is 100x cheaper than DeepL Pro
    const translations = await Promise.all(
      texts.map(async (t) => {
        const result = await translateText(
          {
            text: t,
            sourceLocale: 'en' as Locale,
            targetLocale: targetLang as Locale,
            contentType: 'body',
          },
          { provider: provider as 'gpt' | 'deepl_free_only' }
        );
        return result.translatedText;
      })
    );

    res.json({
      translations,
      targetLang,
      provider: provider,
      costNote: provider === 'gpt'
        ? 'Using GPT-4o-mini (~$0.22/M chars)'
        : 'Using DeepL Free tier (500K chars/month limit)',
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

/**
 * GET /api/translate/languages
 * Returns supported languages
 */
router.get('/languages', (req: Request, res: Response) => {
  res.json({
    supported: SUPPORTED_LANGUAGES,
    defaultProvider: 'gpt',
    providers: {
      gpt: {
        name: 'GPT-4o-mini',
        cost: '~$0.22 per million characters',
        default: true,
      },
      deepl_free_only: {
        name: 'DeepL Free',
        cost: '$0 (500K chars/month limit)',
        default: false,
      },
    },
    warning: 'DeepL Pro is DISABLED - it charged $100 for 4 uses!',
  });
});

/**
 * GET /api/translate/cost-estimate
 * Estimate cost for translation
 */
router.get('/cost-estimate', (req: Request, res: Response) => {
  const charCount = parseInt(req.query.chars as string) || 100000;
  const languages = parseInt(req.query.languages as string) || 17;

  const totalChars = charCount * languages;
  const gptCost = (totalChars / 1000000) * 0.22;
  const deeplProCost = (totalChars / 1000000) * 25;

  res.json({
    charCount,
    languages,
    totalChars,
    costs: {
      'gpt-4o-mini': {
        cost: `$${gptCost.toFixed(2)}`,
        note: 'Recommended - 100x cheaper',
      },
      'deepl-pro': {
        cost: `$${deeplProCost.toFixed(2)}`,
        note: 'DISABLED - too expensive!',
      },
    },
    savings: `$${(deeplProCost - gptCost).toFixed(2)} saved by using GPT-4o-mini`,
  });
});

export default router;
