import {useRouter} from 'next/router';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {siteConfig} from '../../siteConfig';
import {
  getStoredLanguage,
  Language,
  setStoredLanguage,
} from '../../utils/i18n';

const languageIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export function LanguageSwitcher() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('zh-CN');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
  }, []);

  const switchLanguage = (newLanguage: Language) => {
    setStoredLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    setIsOpen(false);

    // Construct new path based on language
    let newPath = router.asPath;
    const currentPath = router.asPath.split(/[\?\#]/)[0];

    // Check if we're on a documentation page
    if (
      currentPath.startsWith('/learn') ||
      currentPath.startsWith('/reference')
    ) {
      // For now, just reload the page to pick up the new language
      // In a full implementation, we would need to check if the translation exists
      window.location.reload();
    } else {
      // For non-documentation pages, just reload
      window.location.reload();
    }
  };

  const otherLanguage =
    currentLanguage === 'zh-CN'
      ? {code: 'en' as Language, label: 'English'}
      : {code: 'zh-CN' as Language, label: '简体中文'};

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Switch Language"
        onClick={() => switchLanguage(otherLanguage.code)}
        className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link"
        title={`Switch to ${otherLanguage.label}`}>
        {languageIcon}
      </button>
    </div>
  );
}
