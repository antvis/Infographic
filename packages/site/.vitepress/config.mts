import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@antv/infographic',
  description: '新一代信息图可视化引擎 - 让数据叙事更简单、更优雅、更高效',
  base: '/',
  lang: 'zh-CN',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '理论', link: '/theory/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: '开发', link: '/dev/overview' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '核心概念', link: '/guide/concepts' },
          ],
        },
        {
          text: '深入',
          items: [
            { text: '主题系统', link: '/guide/theme' },
            { text: '资源加载器', link: '/guide/resource-loader' },
            { text: '高级用法', link: '/guide/advanced' },
          ],
        },
      ],
      '/dev/': [
        {
          text: '开发者指南',
          items: [
            { text: '项目概览', link: '/dev/overview' },
            { text: 'JSX 引擎', link: '/dev/jsx-engine' },
            { text: 'AI 辅助开发', link: '/dev/ai-assisted-development' },
            { text: 'Dev 环境', link: '/dev/dev-environment' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: 'Infographic', link: '/api/infographic' },
            { text: '配置选项', link: '/api/options' },
          ],
        },
        {
          text: '组件',
          items: [
            { text: '结构组件', link: '/api/structures' },
            { text: '数据项组件', link: '/api/items' },
          ],
        },
        {
          text: '扩展',
          items: [{ text: '资源加载', link: '/api/resources' }],
        },
      ],
      '/examples/': [
        {
          text: '示例',
          items: [{ text: '总览', link: '/examples/' }],
        },
      ],
      '/theory/': [
        { text: '基本概念', link: '/theory/' },
        { text: '信息图分类', link: '/theory/classification' },
        { text: '核心理论', link: '/theory/core-theory' },
        { text: '构成要素', link: '/theory/elements' },
        { text: '信息图设计', link: '/theory/design' },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/antvis/infographic' },
    ],

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2025 AntV',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern:
        'https://github.com/antvis/infographic/edit/main/packages/site/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#1890ff' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '信息图,infographic,数据可视化,SVG,图表,AntV,流程图,时间轴',
      },
    ],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:site_name', content: '@antv/infographic' }],
    [
      'meta',
      {
        property: 'og:title',
        content: '@antv/infographic - 新一代信息图可视化引擎',
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content:
          '让数据叙事更简单、更优雅、更高效。30+ 内置组件，15+ 结构布局，开箱即用的专业信息图解决方案',
      },
    ],
    ['meta', { property: 'og:image', content: '/logo.svg' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      {
        name: 'twitter:title',
        content: '@antv/infographic - 新一代信息图可视化引擎',
      },
    ],
    [
      'meta',
      {
        name: 'twitter:description',
        content: '让数据叙事更简单、更优雅、更高效',
      },
    ],

    // 性能优化
    ['link', { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
  ],
});
