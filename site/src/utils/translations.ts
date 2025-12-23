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
      sections: {
        docs: {
          header: '文档',
          quickStart: '快速开始',
          coreConcepts: '核心概念',
          customDesign: '自定义设计',
          theory: '信息图理论',
        },
        api: {
          header: 'API 参考',
          jsx: 'JSX',
          api: 'API',
          designAssets: '设计资产',
        },
        more: {
          header: '更多',
          moreExamples: '更多示例',
          aiInfographic: 'AI 生成信息图',
          github: 'GitHub',
          contribute: '参与贡献',
        },
      },
      friendlyLinksHeader: '友情链接',
    },
    common: {
      searchPlaceholder: '搜索',
      darkMode: '暗色模式',
      lightMode: '亮色模式',
    },
    home: {
      heroPrompts: {
        prompt1Title: '🎯 产品生命周期管理',
        prompt1Text:
          '产品从导入期到成长期，销量快速攀升，市场份额从5%增长至25%。成熟期达到峰值40%后保持稳定。衰退期开始下滑至15%。通过在成长期加大营销投入，成熟期优化成本结构，衰退期及时推出升级产品，实现平稳过渡。',
        prompt2Title: '💰 客户价值分层',
        prompt2Text:
          '将客户分为四个层级：VIP客户占比5%但贡献45%营收，高价值客户占15%贡献30%营收，普通客户占30%贡献20%营收，低价值客户占50%仅贡献5%营收。针对不同层级制定差异化服务策略，重点维护高价值客群，激活潜力客户。',
        prompt3Title: '🌍 全球市场布局进展',
        prompt3Text:
          '2020年聚焦亚太市场，营收占比60%。2021年拓展欧洲市场，占比提升至25%。2022年进军北美，三大市场形成均衡格局，分别为40%、30%、25%。2023年新兴市场突破，拉美和中东合计贡献15%，全球化布局初步完成。',
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
      hero: {
        tagline: '新一代声明式信息图可视化引擎',
        ctaStart: '快速开始',
        ctaAi: 'AI 生成',
        aiCardTitle: 'AI 生成信息图',
        inputLabel: '输入信息图生成描述',
        inputPlaceholder: '用一句话描述你想要的信息图',
        submitFull: '生成信息图',
        submitShort: '生成',
      },
      sections: {
        declarative: {
          title: '声明式信息图渲染框架',
          keyword: '声明式',
          description: '配置描述信息图，让数据叙事更简单、更优雅、更高效',
          note: '100+ 内置模板与组件，开箱可用；从 0 到 1 构建信息图，从未如此轻松',
        },
        ai: {
          title: 'AI 轻松生成专业信息图',
          description:
            '让 AI 理解文本，抽取关键信息并生成配置，一键渲染专业信息图',
          note: '无需设计经验，AI 完成从内容理解到可视化呈现的全流程',
          cta: '前往体验',
        },
        themes: {
          title: '多样主题效果',
          description: '一键切换风格，满足不同场景需求',
          note: '支持自定义主题配置，灵活扩展样式系统',
          cta: '查看主题配置文档',
        },
        playground: {
          title: '在线体验',
          description:
            '在线编辑器中创建你的第一张信息图。用简洁配置快速完成可视化，实时预览即改即见',
          note: '无需安装，在浏览器即可创作。丰富示例助你快速上手，轻松打造专业信息图',
          cta: '查看更多示例',
        },
        evolution: {
          title: '持续演进，拥抱未来',
          description: '愿景：让信息图成为 AI 时代的视觉语言基础设施',
          featuresLabel: '特性',
          roadmapLabel: '未来计划',
          cta: '了解更多动态',
          alt: 'AntV Infographic 团队技术探索示意',
        },
        welcome: {
          title: '欢迎使用 AntV Infographic',
          cta: '立即开始',
        },
      },
    },
    iconPage: {
      metaTitle: 'Icon 智能推荐',
      presetQueries: [
        '数据分析',
        '人机协作',
        '金融',
        '安全防护',
        '可视化',
        '出行',
      ],
      copyLink: '复制链接',
      linkCopied: '图标链接已复制',
      svgCopied: 'SVG 代码已复制',
      copySvg: '复制 SVG',
      link: '链接',
      svgLabel: 'SVG',
      recommendedIcon: (n: number) => `推荐图标 ${n}`,
      hero: {
        titlePrefix: 'Infographic',
        titleHighlight: 'Icons',
        description: '提供 100,000+ 图标，支持语义化查询检索',
      },
      search: {
        badge: 'ICON SEARCH',
        title: '语义化检索图标',
        placeholder: '例如：笔记本电脑',
        button: '搜索',
        buttonLoading: '搜索中',
        topKOption: (n: number) => `Top ${n}`,
      },
      errors: {
        noResult: '未获取到结果，请稍后再试',
        fetch: '获取图标时发生错误',
      },
      notifications: {
        endpointCopied: '接口地址已复制',
      },
      sidebar: {
        title: 'OpenAPI',
        endpoint: 'Endpoint',
        searchParams: 'Search Parameters',
        response: 'Response',
        paramTextLabel: 'text',
        paramTextType: 'string',
        paramTextDescription: '查询文本，如 "数据分析"。',
        paramTopKLabel: 'topK',
        paramTopKType: 'number',
        paramTopKDefault: '默认：5',
        paramTopKDescription: '查询图标数量 (1-20)。',
      },
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
      page: {
        heroTitlePrefix: 'Infographic',
        heroTitleHighlight: 'Gallery',
        heroDescription:
          '探索我们精选的信息图模板库，高保真设计、灵活可定制，可即插即用地投入你的应用。',
        filterLabel: '筛选',
        clearFilters: '清除筛选',
        useTemplate: '使用',
        seriesCount: (count: number) => `${count} 张`,
        expandAll: '展开全部',
        collapse: '收起',
      },
      detail: {
        back: '返回素材库',
        templateLabel: '模板',
        fileLabel: 'index.js',
        errorBadge: '错误',
        reset: '重置代码',
        copy: '复制',
        copySuccess: '已复制',
        status: (line: number) => `第 ${line} 行，第 1 列`,
        footer: 'UTF-8 • JavaScript',
        errors: {
          syntax: '语法错误：配置无效',
          render: (msg: string) => `渲染错误：${msg}`,
          execution: (msg: string) => `执行错误：${msg}`,
        },
      },
    },
    aiPage: {
      pending: '待输入',
      metaTitle: 'AI 生成信息图',
      hero: {
        title: 'AI',
        highlight: 'Infographic',
        description:
          '将你在日常写作、汇报或其他文字工作中遇到的内容粘贴到这里，AI 会理解语境并为你生成相匹配的信息图方案',
      },
      workspaceLabel: 'AI 工作区',
      chat: {
        historyTitle: '生成记录',
        configure: '配置服务',
        clear: '清空对话',
        shortcut: '⌘/Ctrl + ↵',
        emptyTitle: '开始你的创作',
        emptyDescription: '还没有生成记录，使用下方示例或粘贴你的内容开始。',
        retry: '重试',
        deleteAria: '删除记录',
        placeholder: '提供你的数据，我会帮你生成信息图',
        helper: '明确图表类型、数据来源、配色/风格，会生成得更准',
        send: '生成信息图',
        sending: '生成中...',
      },
      preview: {
        tabPreview: '预览',
        tabSyntax: '语法',
        copyImage: '复制图片',
        generating: '生成中...',
        empty: '输入提示语以生成信息图语法',
      },
      notifications: {
        copyImage: '已复制图片',
      },
      errors: {
        requestIncomplete: '请求未完成',
        noOutput: '未接收到模型输出',
        noModel: '模型未返回内容',
        generationFailed: '生成失败，请检查网络或稍后重试。',
        apiKey: '生成失败，请检查 API Key 或网络连接',
        jsonParse: 'JSON 解析失败',
      },
      examples: [
        {
          title: '🎯 产品生命周期管理',
          text: '产品从导入期到成长期，销量快速攀升，市场份额从5%增长至25%。成熟期达到峰值40%后保持稳定。衰退期开始下滑至15%。通过在成长期加大营销投入，成熟期优化成本结构，衰退期及时推出升级产品，实现平稳过渡。',
        },
        {
          title: '💰 客户价值分层',
          text: '将客户分为四个层级：VIP客户占比5%但贡献45%营收，高价值客户占15%贡献30%营收，普通客户占30%贡献20%营收，低价值客户占50%仅贡献5%营收。针对不同层级制定差异化服务策略，重点维护高价值客群，激活潜力客户。',
        },
        {
          title: '🌍 全球市场布局进展',
          text: '2020年聚焦亚太市场，营收占比60%。2021年拓展欧洲市场，占比提升至25%。2022年进军北美，三大市场形成均衡格局，分别为40%、30%、25%。2023年新兴市场突破，拉美和中东合计贡献15%，全球化布局初步完成。',
        },
      ],
      fallbackSyntax: `infographic list-row-horizontal-icon-arrow\ndata\n  title 客户增长引擎\n  desc 多渠道触达与复购提升\n  items\n    - label 线索获取\n      value 18.6\n      desc 渠道投放与内容获客\n      icon mdi/rocket-launch\n    - label 转化提效\n      value 12.4\n      desc 线索评分与自动跟进\n      icon mdi/progress-check\n    - label 复购提升\n      value 9.8\n      desc 会员体系与权益运营\n      icon mdi/account-sync\n    - label 产品增长\n      value 10.2\n      desc 试用转化与功能引导\n      icon mdi/chart-line`,
      config: {
        title: '配置模型服务',
        provider: '提供商',
        providerPlaceholder: '选择提供商',
        presetNotice: '正在使用 AntV 内置服务，无需额外配置。',
        baseUrl: 'Base URL',
        apiKey: 'API Key',
        model: '模型',
        modelPlaceholder: '选择模型',
        customOption: '自定义',
        fetchingModels: '正在获取模型列表…',
        save: '保存配置',
        reset: '重置',
        cancel: '取消',
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
      sections: {
        docs: {
          header: 'Docs',
          quickStart: 'Quick Start',
          coreConcepts: 'Core Concepts',
          customDesign: 'Custom Design',
          theory: 'Infographic Theory',
        },
        api: {
          header: 'API Reference',
          jsx: 'JSX',
          api: 'API',
          designAssets: 'Design Assets',
        },
        more: {
          header: 'More',
          moreExamples: 'More Examples',
          aiInfographic: 'AI Generated Infographics',
          github: 'GitHub',
          contribute: 'Contribute',
        },
      },
      friendlyLinksHeader: 'Friendly Links',
    },
    common: {
      searchPlaceholder: 'Search',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
    },
    home: {
      heroPrompts: {
        prompt1Title: '🎯 Product Lifecycle Management',
        prompt1Text:
          'From introduction to growth phase, sales rapidly increased and market share grew from 5% to 25%. During maturity, it peaked at 40% and remained stable. In the decline phase, it dropped to 15%. By increasing marketing investment during growth, optimizing cost structure during maturity, and timely launching upgraded products during decline, a smooth transition was achieved.',
        prompt2Title: '💰 Customer Value Segmentation',
        prompt2Text:
          'Customers are divided into four tiers: VIP customers account for 5% but contribute 45% of revenue, high-value customers 15% contribute 30% of revenue, regular customers 30% contribute 20% of revenue, and low-value customers 50% contribute only 5% of revenue. Differentiated service strategies are developed for different tiers, focusing on maintaining high-value customer groups and activating potential customers.',
        prompt3Title: '🌍 Global Market Expansion',
        prompt3Text:
          'In 2020, focused on the Asia-Pacific market, accounting for 60% of revenue. In 2021, expanded to the European market, increasing to 25%. In 2022, entered North America, forming a balanced pattern across three major markets at 40%, 30%, and 25% respectively. In 2023, emerging markets broke through, with Latin America and the Middle East contributing a combined 15%, completing the initial globalization layout.',
      },
      features: {
        feature1Title: 'Infographic Syntax',
        feature1Detail:
          'Declarative syntax tailored for infographic features, covering layouts, elements, and themes',
        feature2Title: 'JSX Custom Development',
        feature2Detail:
          'Describe design assets with JSX, intuitive and reusable, flexibly extensible',
        feature3Title: 'Stylized Rendering',
        feature3Detail:
          'One template, multiple styles, supporting hand-drawn, textures, gradients, and other effects',
        feature4Title: 'Visual Editing',
        feature4Detail:
          'Interactive addition and deletion of data items, adding shapes and annotations, WYSIWYG',
      },
      hero: {
        tagline: 'Next-generation declarative infographic engine',
        ctaStart: 'Get Started',
        ctaAi: 'AI Generate',
        aiCardTitle: 'AI Generated Infographics',
        inputLabel: 'Enter an infographic description',
        inputPlaceholder: 'Describe the infographic you want in one sentence',
        submitFull: 'Generate',
        submitShort: 'Generate',
      },
      sections: {
        declarative: {
          title: 'Declarative Infographic Rendering',
          keyword: 'Declarative',
          description:
            'Describe infographics declaratively to make data stories simpler, cleaner, and more efficient',
          note: '100+ built-in templates and components help you go from 0 to 1 with ease',
        },
        ai: {
          title: 'AI Creates Pro Infographics',
          description:
            'Let AI understand text, extract key information, and render polished infographics in one click',
          note: 'No design background required—AI covers the entire flow from understanding to visualization',
          cta: 'Try It Now',
        },
        themes: {
          title: 'Rich Theme Effects',
          description: 'Switch styles in one click to fit different scenarios',
          note: 'Customize theme configuration to extend the styling system',
          cta: 'View Theme Docs',
        },
        playground: {
          title: 'Playground',
          description:
            'Create your first infographic in the online editor. Use concise configs and preview changes instantly',
          note: 'Create right in the browser. Plenty of examples help you ramp up fast',
          cta: 'View More Examples',
        },
        evolution: {
          title: 'Evolving for the Future',
          description:
            'Vision: make infographics the visual language infrastructure for the AI era',
          featuresLabel: 'Features',
          roadmapLabel: 'Roadmap',
          cta: 'More Updates',
          alt: 'AntV Infographic team exploration illustration',
        },
        welcome: {
          title: 'Welcome to AntV Infographic',
          cta: 'Start Now',
        },
      },
    },
    iconPage: {
      metaTitle: 'Icon Recommendation',
      presetQueries: [
        'Data Analysis',
        'Human-AI Collaboration',
        'Finance',
        'Security',
        'Visualization',
        'Transportation',
      ],
      copyLink: 'Copy Link',
      linkCopied: 'Icon link copied',
      svgCopied: 'SVG code copied',
      copySvg: 'Copy SVG',
      link: 'Link',
      svgLabel: 'SVG',
      recommendedIcon: (n: number) => `Recommended Icon ${n}`,
      hero: {
        titlePrefix: 'Infographic',
        titleHighlight: 'Icons',
        description: 'Over 100,000 icons with semantic search support',
      },
      search: {
        badge: 'ICON SEARCH',
        title: 'Semantic icon search',
        placeholder: 'e.g. laptop',
        button: 'Search',
        buttonLoading: 'Searching...',
        topKOption: (n: number) => `Top ${n}`,
      },
      errors: {
        noResult: 'No results yet, please try again later',
        fetch: 'Failed to fetch icons',
      },
      notifications: {
        endpointCopied: 'Endpoint copied',
      },
      sidebar: {
        title: 'OpenAPI',
        endpoint: 'Endpoint',
        searchParams: 'Search Parameters',
        response: 'Response',
        paramTextLabel: 'text',
        paramTextType: 'string',
        paramTextDescription: 'Query text, e.g. "data analysis".',
        paramTopKLabel: 'topK',
        paramTopKType: 'number',
        paramTopKDefault: 'default: 5',
        paramTopKDescription: 'Number of icons to fetch (1-20).',
      },
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
      page: {
        heroTitlePrefix: 'Infographic',
        heroTitleHighlight: 'Gallery',
        heroDescription:
          'Explore our curated infographic template library with high-fidelity designs ready to drop into your apps.',
        filterLabel: 'Filter',
        clearFilters: 'Clear all',
        useTemplate: 'Use',
        seriesCount: (count: number) => `${count} templates`,
        expandAll: 'Expand All',
        collapse: 'Collapse',
      },
      detail: {
        back: 'Back to Gallery',
        templateLabel: 'Template',
        fileLabel: 'index.js',
        errorBadge: 'Error',
        reset: 'Reset Code',
        copy: 'Copy',
        copySuccess: 'Copied',
        status: (line: number) => `Line ${line}, Col 1`,
        footer: 'UTF-8 • JavaScript',
        errors: {
          syntax: 'Syntax Error: Invalid configuration object',
          render: (msg: string) => `Render Error: ${msg}`,
          execution: (msg: string) => `Execution Error: ${msg}`,
        },
      },
    },
    aiPage: {
      pending: 'Pending input',
      metaTitle: 'AI Infographic',
      hero: {
        title: 'AI',
        highlight: 'Infographic',
        description:
          'Paste content from writing, reporting, or any text task and AI will understand the context and output an infographic plan.',
      },
      workspaceLabel: 'AI Workspace',
      chat: {
        historyTitle: 'Generation History',
        configure: 'Configure Service',
        clear: 'Clear Conversation',
        shortcut: '⌘/Ctrl + ↵',
        emptyTitle: 'Start creating',
        emptyDescription:
          'No generations yet. Use the examples below or paste your content to get started.',
        retry: 'Retry',
        deleteAria: 'Delete record',
        placeholder:
          'Provide your data and I will create an infographic for you',
        helper:
          'Specify chart types, data sources, and palette/style to get better results',
        send: 'Generate',
        sending: 'Generating...',
      },
      preview: {
        tabPreview: 'Preview',
        tabSyntax: 'Syntax',
        copyImage: 'Copy image',
        generating: 'Generating...',
        empty: 'Enter a prompt to generate infographic syntax',
      },
      notifications: {
        copyImage: 'Image copied',
      },
      errors: {
        requestIncomplete: 'Request was not completed',
        noOutput: 'No model output received',
        noModel: 'The model did not return content',
        generationFailed:
          'Generation failed. Check the network or try again later.',
        apiKey:
          'Generation failed, please check your API key or network connection',
        jsonParse: 'JSON parse error',
      },
      examples: [
        {
          title: '🎯 Product Lifecycle Management',
          text: 'From introduction to growth phase, sales rapidly increased and market share grew from 5% to 25%. During maturity, it peaked at 40% and remained stable. In the decline phase, it dropped to 15%. By increasing marketing investment during growth, optimizing cost structure during maturity, and timely launching upgraded products during decline, a smooth transition was achieved.',
        },
        {
          title: '💰 Customer Value Segmentation',
          text: 'Customers are divided into four tiers: VIP customers account for 5% but contribute 45% of revenue, high-value customers 15% contribute 30% of revenue, regular customers 30% contribute 20% of revenue, and low-value customers 50% contribute only 5% of revenue. Differentiated service strategies are developed for different tiers, focusing on maintaining high-value customer groups and activating potential customers.',
        },
        {
          title: '🌍 Global Market Expansion',
          text: 'In 2020, focused on the Asia-Pacific market, accounting for 60% of revenue. In 2021, expanded to the European market, increasing to 25%. In 2022, entered North America, forming a balanced pattern across three major markets at 40%, 30%, and 25% respectively. In 2023, emerging markets broke through, with Latin America and the Middle East contributing a combined 15%, completing the initial globalization layout.',
        },
      ],
      fallbackSyntax: `infographic list-row-horizontal-icon-arrow\ndata\n  title Customer Growth Engine\n  desc Multi-channel reach and retention\n  items\n    - label Lead Acquisition\n      value 18.6\n      desc Paid media and content marketing\n      icon mdi/rocket-launch\n    - label Conversion Boost\n      value 12.4\n      desc Lead scoring with automated follow-ups\n      icon mdi/progress-check\n    - label Loyalty Growth\n      value 9.8\n      desc Membership programs and benefits\n      icon mdi/account-sync\n    - label Product Growth\n      value 10.2\n      desc Trial conversion and feature onboarding\n      icon mdi/chart-line`,
      config: {
        title: 'Configure Model Service',
        provider: 'Provider',
        providerPlaceholder: 'Select a provider',
        presetNotice: 'Using AntV built-in service, no setup required.',
        baseUrl: 'Base URL',
        apiKey: 'API Key',
        model: 'Model',
        modelPlaceholder: 'Select a model',
        customOption: 'Custom',
        fetchingModels: 'Fetching model list…',
        save: 'Save',
        reset: 'Reset',
        cancel: 'Cancel',
      },
    },
  },
};

export type Language = keyof typeof translations;

export function t(language: Language, key: string, ...args: any[]): any {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  if (typeof value === 'function') {
    return value(...args);
  }

  return value || key;
}
