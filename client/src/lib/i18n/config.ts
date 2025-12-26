import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LOCALES, RTL_LOCALES, type Locale } from '@shared/schema';

// Import all locale files - 17 supported languages
import enCommon from '../../locales/en/common.json';
import heCommon from '../../locales/he/common.json';
import arCommon from '../../locales/ar/common.json';
import zhCommon from '../../locales/zh/common.json';
import ruCommon from '../../locales/ru/common.json';
import deCommon from '../../locales/de/common.json';
import frCommon from '../../locales/fr/common.json';
import esCommon from '../../locales/es/common.json';
import ptCommon from '../../locales/pt/common.json';
import hiCommon from '../../locales/hi/common.json';
import bnCommon from '../../locales/bn/common.json';
import jaCommon from '../../locales/ja/common.json';
import koCommon from '../../locales/ko/common.json';
import filCommon from '../../locales/fil/common.json';
import urCommon from '../../locales/ur/common.json';
import faCommon from '../../locales/fa/common.json';
import itCommon from '../../locales/it/common.json';

// Resources object - all 17 language translations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resources: Record<string, { common: any }> = {
  en: { common: enCommon },
  he: { common: heCommon },
  ar: { common: arCommon },
  zh: { common: zhCommon },
  ru: { common: ruCommon },
  de: { common: deCommon },
  fr: { common: frCommon },
  es: { common: esCommon },
  pt: { common: ptCommon },
  hi: { common: hiCommon },
  bn: { common: bnCommon },
  ja: { common: jaCommon },
  ko: { common: koCommon },
  fil: { common: filCommon },
  ur: { common: urCommon },
  fa: { common: faCommon },
  it: { common: itCommon },
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ['path', 'localStorage'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

// Helper function to check if locale is RTL
export const isRTL = (locale: Locale): boolean => {
  return RTL_LOCALES.includes(locale);
};

// Helper function to get locale info
export const getLocaleInfo = (code: Locale) => {
  return SUPPORTED_LOCALES.find(l => l.code === code);
};

// Helper function to get all locales by tier
export const getLocalesByTier = (tier: number) => {
  return SUPPORTED_LOCALES.filter(l => l.tier === tier);
};

// Helper function to change language and update document direction
export const changeLanguage = async (locale: Locale) => {
  await i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
  localStorage.setItem('i18nextLng', locale);
};

// Get current locale
export const getCurrentLocale = (): Locale => {
  return (i18n.language || 'en') as Locale;
};

export default i18n;
