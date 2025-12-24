'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import {siteConfig} from '../siteConfig';
import {
  LANGUAGE_STORAGE_KEY,
  Language,
  getStoredLanguage,
  setStoredLanguage,
} from '../utils/i18n';

/**
 * Hook for managing application language state
 *
 * @returns Object containing current language and setLanguage function
 *
 * @example
 * ```tsx
 * const { language, setLanguage } = useTranslation();
 * // Switch to English
 * setLanguage('en-US');
 * ```
 */
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(
    () => siteConfig.defaultLanguage as Language
  );

  useEffect(() => {
    setLanguageState(getStoredLanguage());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY && event.newValue) {
        setLanguageState(event.newValue as Language);
      }
    };
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const changeLanguage = useCallback((next: Language) => {
    setStoredLanguage(next);
    setLanguageState(next);
  }, []);

  return useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
    }),
    [language, changeLanguage]
  );
}

/**
 * Hook for getting localized content from a translation bundle
 *
 * @param bundle - Object with Language keys ('zh-CN', 'en-US') and translation values
 * @param fallbackLanguage - Language to use if current language not found (default: 'zh-CN')
 * @returns Translations for the current language
 *
 * @example
 * ```tsx
 * const NAV_TRANSLATIONS = {
 *   'zh-CN': { home: '首页', about: '关于' },
 *   'en-US': { home: 'Home', about: 'About' }
 * };
 *
 * function MyComponent() {
 *   const navTexts = useLocaleBundle(NAV_TRANSLATIONS);
 *   return <div>{navTexts.home}</div>;
 * }
 * ```
 */
export function useLocaleBundle<T>(
  bundle: Record<Language, T>,
  fallbackLanguage: Language = siteConfig.defaultLanguage as Language
): T {
  const {language} = useTranslation();
  const fallback =
    bundle[fallbackLanguage] ?? Object.values(bundle)[0] ?? ({} as T);
  return bundle[language] ?? fallback;
}
