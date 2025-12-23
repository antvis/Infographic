import {siteConfig} from '../siteConfig';

const LANGUAGE_STORAGE_KEY = 'infographic-site-language';

export type Language = 'zh-CN' | 'en';

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return siteConfig.defaultLanguage as Language;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'zh-CN' || stored === 'en')) {
      return stored as Language;
    }
  } catch (e) {
    // localStorage might not be available
  }

  return siteConfig.defaultLanguage as Language;
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

export function getLanguageLabel(code: Language): string {
  const lang = siteConfig.languages.find((l: any) => l.code === code);
  return lang?.label || code;
}
