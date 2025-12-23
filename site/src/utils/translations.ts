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
    home: {
      heroPrompts: {
        prompt1Title: '🎯 产品生命周期管理',
        prompt1Text: '产品从导入期到成长期，销量快速攀升，市场份额从5%增长至25%。成熟期达到峰值40%后保持稳定。衰退期开始下滑至15%。通过在成长期加大营销投入，成熟期优化成本结构，衰退期及时推出升级产品，实现平稳过渡。',
        prompt2Title: '💰 客户价值分层',
        prompt2Text: '将客户分为四个层级：VIP客户占比5%但贡献45%营收，高价值客户占15%贡献30%营收，普通客户占30%贡献20%营收，低价值客户占50%仅贡献5%营收。针对不同层级制定差异化服务策略，重点维护高价值客群，激活潜力客户。',
        prompt3Title: '🌍 全球市场布局进展',
        prompt3Text: '2020年聚焦亚太市场，营收占比60%。2021年拓展欧洲市场，占比提升至25%。2022年进军北美，三大市场形成均衡格局，分别为40%、30%、25%。2023年新兴市场突破，拉美和中东合计贡献15%，全球化布局初步完成。',
      },
      features: {
        feature1Title: '信息图语法',
        feature1Detail: '贴合信息图特性的声明式语法，涵盖布局、元素、主题',
        feature2Title: 'JSX 定制开发',
        feature2Detail: '以 JSX 描述设计资产，直观可复用，灵活扩展',
        feature3Title: '风格化渲染',
        feature3Detail: '一套模板多种风格，支持手绘、纹理、渐变等效果',
        feature4Title: '可视化编辑',
        feature4Detail: '可交互增删数据项，添加图形与标注，所见即所得',
      },
    },
    iconPage: {
      presetQueries: ['数据分析', '人机协作', '金融', '安全防护', '可视化', '出行'],
      copyLink: '复制链接',
      linkCopied: '图标链接已复制',
      svgCopied: 'SVG 代码已复制',
      link: '链接',
      recommendedIcon: (n: number) => `推荐图标 ${n}`,
    },
    gallery: {
      types: {
        compare: '对比型',
        list: '列表型',
        chart: '图表型',
        relation: '关系型',
        sequence: '顺序型',
        quadrant: '四象限型',
        hierarchy: '层级型',
      },
      series: {
        'hierarchy-tree': '层级树',
        'hierarchy-mindmap': '思维导图',
      },
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
    home: {
      heroPrompts: {
        prompt1Title: '🎯 Product Lifecycle Management',
        prompt1Text: 'From introduction to growth phase, sales rapidly increased and market share grew from 5% to 25%. During maturity, it peaked at 40% and remained stable. In the decline phase, it dropped to 15%. By increasing marketing investment during growth, optimizing cost structure during maturity, and timely launching upgraded products during decline, a smooth transition was achieved.',
        prompt2Title: '💰 Customer Value Segmentation',
        prompt2Text: 'Customers are divided into four tiers: VIP customers account for 5% but contribute 45% of revenue, high-value customers 15% contribute 30% of revenue, regular customers 30% contribute 20% of revenue, and low-value customers 50% contribute only 5% of revenue. Differentiated service strategies are developed for different tiers, focusing on maintaining high-value customer groups and activating potential customers.',
        prompt3Title: '🌍 Global Market Expansion',
        prompt3Text: 'In 2020, focused on the Asia-Pacific market, accounting for 60% of revenue. In 2021, expanded to the European market, increasing to 25%. In 2022, entered North America, forming a balanced pattern across three major markets at 40%, 30%, and 25% respectively. In 2023, emerging markets broke through, with Latin America and the Middle East contributing a combined 15%, completing the initial globalization layout.',
      },
      features: {
        feature1Title: 'Infographic Syntax',
        feature1Detail: 'Declarative syntax tailored for infographic features, covering layouts, elements, and themes',
        feature2Title: 'JSX Custom Development',
        feature2Detail: 'Describe design assets with JSX, intuitive and reusable, flexibly extensible',
        feature3Title: 'Stylized Rendering',
        feature3Detail: 'One template, multiple styles, supporting hand-drawn, textures, gradients, and other effects',
        feature4Title: 'Visual Editing',
        feature4Detail: 'Interactive addition and deletion of data items, adding shapes and annotations, WYSIWYG',
      },
    },
    iconPage: {
      presetQueries: ['Data Analysis', 'Human-AI Collaboration', 'Finance', 'Security', 'Visualization', 'Transportation'],
      copyLink: 'Copy Link',
      linkCopied: 'Icon link copied',
      svgCopied: 'SVG code copied',
      link: 'Link',
      recommendedIcon: (n: number) => `Recommended Icon ${n}`,
    },
    aiPage: {
      pending: 'Pending input',
    },
    gallery: {
      types: {
        compare: 'Comparison',
        list: 'List',
        chart: 'Chart',
        relation: 'Relation',
        sequence: 'Sequence',
        quadrant: 'Quadrant',
        hierarchy: 'Hierarchy',
      },
      series: {
        'hierarchy-tree': 'Hierarchy Tree',
        'hierarchy-mindmap': 'Mind Map',
      },
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
