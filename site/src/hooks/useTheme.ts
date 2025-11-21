import {useEffect, useState} from 'react';

type ThemeMode = 'light' | 'dark';

declare global {
  interface Window {
    __theme?: ThemeMode;
  }
}

const getThemeFromDocument = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.__theme) {
    return window.__theme === 'dark' ? 'dark' : 'light';
  }

  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  }

  return 'light';
};

export function useTheme(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>(() => getThemeFromDocument());

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const handleChange = () => {
      const next = getThemeFromDocument();
      setTheme((prev) => (prev === next ? prev : next));
    };

    const observer = new MutationObserver(handleChange);
    observer.observe(root, {attributes: true, attributeFilter: ['class']});

    handleChange();

    return () => observer.disconnect();
  }, []);

  return theme;
}
