exports.siteConfig = {
  version: '0.0.1-beta.3',
  // --------------------------------------
  // Site Settings
  languageCode: 'en-US',
  hasLegacySite: false,
  isRTL: false,
  // --------------------------------------
  // Multi-language support
  languages: [
    {code: 'zh-CN', label: '简体中文'},
    {code: 'en-US', label: 'English'},
  ],
  defaultLanguage: 'en-US',
  // --------------------------------------
  copyright: `Copyright © ${new Date().getFullYear()} Ant Group Co. All Rights Reserved.`,
  repoUrl: 'https://github.com/antvis/infographic',
};
