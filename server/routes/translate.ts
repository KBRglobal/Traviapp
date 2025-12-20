/**
 * Translation API endpoint using DeepL
 * POST /api/translate
 *
 * Translates text from English to target language
 */

import { Router, Request, Response } from 'express';

const router = Router();

// DeepL API configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// Map our locale codes to DeepL language codes
const LOCALE_TO_DEEPL: Record<string, string> = {
  ar: 'AR',
  ru: 'RU',
  zh: 'ZH',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  pt: 'PT-PT',
  ja: 'JA',
  ko: 'KO',
  tr: 'TR',
  nl: 'NL',
};

interface TranslateRequest {
  text: string | string[];
  targetLang: string;
}

interface DeepLResponse {
  translations: Array<{
    text: string;
    detected_source_language: string;
  }>;
}

/**
 * POST /api/translate
 * Body: { text: string | string[], targetLang: string }
 * Returns: { translations: string[] }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = req.body as TranslateRequest;

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'text and targetLang are required' });
    }

    if (!DEEPL_API_KEY) {
      return res.status(500).json({ error: 'DEEPL_API_KEY not configured' });
    }

    const deeplLang = LOCALE_TO_DEEPL[targetLang];
    if (!deeplLang) {
      return res.status(400).json({
        error: `Language ${targetLang} not supported`,
        supported: Object.keys(LOCALE_TO_DEEPL)
      });
    }

    const texts = Array.isArray(text) ? text : [text];

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        source_lang: 'EN',
        target_lang: deeplLang,
        ...texts.reduce((acc, t, i) => ({ ...acc, [`text`]: t }), {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepL API error:', error);
      return res.status(502).json({ error: 'Translation service error' });
    }

    const result: DeepLResponse = await response.json();

    res.json({
      translations: result.translations.map(t => t.text),
      targetLang,
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
    supported: Object.keys(LOCALE_TO_DEEPL),
    mapping: LOCALE_TO_DEEPL,
  });
});

export default router;
