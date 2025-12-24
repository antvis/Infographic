import {useEffect, useState} from 'react';
import {siteConfig} from '../../siteConfig';
import {getStoredLanguage, Language, setStoredLanguage} from '../../utils/i18n';

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
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    siteConfig.defaultLanguage as Language
  );

  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
  }, []);

  const switchLanguage = (newLanguage: Language) => {
    setStoredLanguage(newLanguage);
    setCurrentLanguage(newLanguage);

    // Reload the page to pick up the new language
    window.location.reload();
  };

  /**
   * 动态获取下一个可用语言
   * 从 siteConfig.languages 中循环选择下一个语言
   */
  const getNextLanguage = () => {
    const currentIndex = siteConfig.languages.findIndex(
      (lang) => lang.code === currentLanguage
    );

    // 如果找不到当前语言或只有一个语言，返回默认语言
    if (currentIndex === -1 || siteConfig.languages.length <= 1) {
      return siteConfig.languages[0];
    }

    // 获取下一个语言（循环）
    const nextIndex = (currentIndex + 1) % siteConfig.languages.length;
    return siteConfig.languages[nextIndex];
  };

  const nextLanguage = getNextLanguage();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Switch Language"
        onClick={() => switchLanguage(nextLanguage.code as Language)}
        className="flex items-center justify-center w-12 h-12 transition-transform rounded-full active:scale-95 hover:bg-primary/5 hover:dark:bg-primary-dark/5 outline-link"
        title={`Switch to ${nextLanguage.label}`}>
        {languageIcon}
      </button>
    </div>
  );
}
