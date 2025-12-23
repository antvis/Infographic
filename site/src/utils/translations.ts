export const translations = {
  'zh-CN': {
    nav: {
      home: '首页',
      learn: '文档',
      reference: '参考',
      examples: '示例',
      icon: '图标',
      ai: 'AI',
      enterprise: '企业版',
    },
    footer: {
      copyright: (year: number) =>
        `Copyright © ${year} Ant Group Co. All Rights Reserved.`,
    },
    common: {
      searchPlaceholder: '搜索',
      darkMode: '暗色模式',
      lightMode: '亮色模式',
    },
  },
  en: {
    nav: {
      home: 'Home',
      learn: 'Learn',
      reference: 'Reference',
      examples: 'Examples',
      icon: 'Icons',
      ai: 'AI',
      enterprise: 'Enterprise',
    },
    footer: {
      copyright: (year: number) =>
        `Copyright © ${year} Ant Group Co. All Rights Reserved.`,
    },
    common: {
      searchPlaceholder: 'Search',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
    },
  },
};

export type Language = keyof typeof translations;

export function t(
  language: Language,
  key: string,
  ...args: any[]
): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (typeof value === 'function') {
    return value(...args);
  }

  return value || key;
}
