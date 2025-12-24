import {siteConfig} from '../siteConfig';

export const LANGUAGE_STORAGE_KEY = 'infographic-site-language';

export type Language = 'zh-CN' | 'en-US';

const supportedLanguages = siteConfig.languages.map(
  (l: any) => l.code as Language
);

function normalizeLanguage(code: string | undefined): Language | null {
  if (!code) return null;
  const normalized = code.toLowerCase();
  const exactMatch = supportedLanguages.find(
    (lang) => normalized === lang.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  const prefixMatch = supportedLanguages.find((lang) =>
    normalized.startsWith(lang.toLowerCase().split('-')[0])
  );
  if (prefixMatch) return prefixMatch;

  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en-US';
  return null;
}

function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return siteConfig.defaultLanguage as Language;
  }
  const preferred =
    navigator.language || (navigator.languages && navigator.languages[0]);
  return (
    normalizeLanguage(preferred) ?? (siteConfig.defaultLanguage as Language)
  );
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return detectBrowserLanguage();
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && normalizeLanguage(stored)) {
      return stored as Language;
    }
  } catch (e) {
    // localStorage might not be available
  }

  return detectBrowserLanguage();
}

export function setStoredLanguage(language: Language): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (e) {
    // localStorage might not be available
  }
}
