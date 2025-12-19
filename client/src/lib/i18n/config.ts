import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LOCALES, RTL_LOCALES, type Locale } from '@shared/schema';

// Import all locale files
import enCommon from '../../locales/en/common.json';

// Resources object - will be populated with all translations
const resources: Record<string, { common: typeof enCommon }> = {
  en: { common: enCommon },
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
      order: ['path', 'localStorage', 'navigator'],
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
