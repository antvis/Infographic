exports.siteConfig = {
  version: '0.0.1-beta.3',
  // --------------------------------------
  // Site Settings
  languageCode: 'zh-CN',
  hasLegacySite: false,
  isRTL: false,
  // --------------------------------------
  // Multi-language support
  languages: [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en', label: 'English' }
  ],
  defaultLanguage: 'zh-CN',
  // --------------------------------------
  copyright: `Copyright © ${new Date().getFullYear()} Ant Group Co. All Rights Reserved.`,
  repoUrl: 'https://github.com/antvis/infographic',
};
