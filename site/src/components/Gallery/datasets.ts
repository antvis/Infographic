export const DATASET = {
  COMPARE: {
    title: '竞品分析',
    desc: '通过对比分析，找出差距，明确改进方向',
    items: [
      {
        label: '产品分析',
        children: [
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
        ],
      },
      {
        label: '竞品分析',
        children: [
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
          {
            label: '架构升级',
            desc: '品牌营销策略就是以品牌输出为核心的营销策略',
          },
        ],
      },
    ],
  },
  SWOT: {
    title: 'SWOT分析',
    desc: '通过对比分析，找出差距，明确改进方向',
    items: [
      {
        label: 'Strengths',
        children: [
          {
            label: '强大的品牌影响力强大的品牌影响力',
          },
          {
            label: '丰富的产品线和服务',
          },
        ],
      },
      {
        label: 'Weaknesses',
        children: [
          {
            label: '市场份额有限',
          },
          {
            label: '品牌知名度较低',
          },
          {
            label: '技术创新能力不足',
          },
        ],
      },
      {
        label: 'Opportunities',
        children: [
          {
            label: '新兴市场的增长机会',
          },
          {
            label: '数字化转型的趋势',
          },
          {
            label: '战略合作伙伴关系的建立',
          },
        ],
      },
      {
        label: 'Threats',
        children: [
          {
            label: '激烈的市场竞争',
          },
          {
            label: '快速变化的消费者需求',
          },
          {
            label: '经济环境的不确定性',
          },
          {
            label: '技术进步带来的挑战',
          },
        ],
      },
    ],
  },
  LIST: {
    title: '产业布局',
    desc: '整合数据资产，构建标签画像体系，赋能数字化运营之路',
    items: [
      {
        icon: 'icon:mingcute/apple-fill',
        label: '企业形象优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 80,
        time: '2018',
        illus: 'illus:beer',
      },
      {
        icon: 'icon:mingcute/bear-fill',
        label: '综合实力优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 70,
        time: '2019',
        illus: 'illus:best-place',
      },
      {
        icon: 'icon:mingcute/bell-ringing-fill',
        label: '企业营销优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 90,
        time: '2020',
        illus: 'illus:blank-canvas',
      },
      {
        icon: 'icon:mingcute/bowknot-fill',
        label: '产品定位优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 60,
        time: '2021',
        illus: 'illus:breakfast',
      },
      {
        icon: 'icon:mingcute/camera-2-ai-fill',
        label: '产品体验优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 80,
        time: '2022',
        illus: 'illus:building-websites',
      },
      // {
      //   icon: 'icon:mingcute/car-fill',
      //   label: '制造成本优势',
      //   desc: '产品优势详细说明产品优势详细说明',
      //   value: 90,
      //   time: '2023',
      //   illus: 'illus:bus-stop',
      // },
      // {
      //   icon: 'icon:mingcute/compass-fill',
      //   label: '制造成本优势',
      //   desc: '产品优势详细说明产品优势详细说明',
      //   value: 97,
      //   time: '2024',
      //   illus: 'illus:by-the-road',
      // },
    ],
  },
  HIERARCHY: {
    title: '用户调研',
    desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
    items: [
      {
        label: '用户调研',
        icon: 'icon:mingcute/diamond-2-fill',
        children: [
          {
            label: '用户为什么要使用某个音乐平台',
            desc: '用户为什么要使用某个音乐平台',
            icon: 'icon:mingcute/apple-fill',
            children: [
              {
                label: '用户从哪些渠道了解到这个平台',
                icon: 'icon:mingcute/camera-2-ai-fill',
              },
              {
                label: '这个平台是哪些方面吸引了用户',
                icon: 'icon:mingcute/camera-2-ai-fill',
              },
            ],
          },
          {
            label: '用户在什么场景下使用这个平台',
            desc: '用户在什么场景下使用这个平台',
            icon: 'icon:mingcute/bear-fill',
            children: [
              {
                label: '用户从什么事件什么场景下使用',
                icon: 'icon:mingcute/car-fill',
              },
              {
                label: '用户在某个场景下用到哪些功能',
                icon: 'icon:mingcute/car-fill',
              },
            ],
          },
          {
            label: '用户什么原因下会离开这个平台',
            desc: '用户什么原因下会离开这个平台',
            icon: 'icon:mingcute/bell-ringing-fill',
            children: [
              {
                label: '用户无法接受这个平台的原因',
                icon: 'icon:mingcute/car-fill',
              },
              {
                label: '用户觉得这个平台有哪些不足',
                icon: 'icon:mingcute/car-fill',
              },
            ],
          },
        ],
      },
    ],
  },
  QUADRANT: {
    title: '风险控制',
    desc: '风险频率与损失程度分析',
    items: [
      {
        label: '高损高频',
        desc: '直接规避风险',
        icon: 'icon:mingcute/currency-bitcoin-2-fill',
        illus: 'illus:notify',
      },
      {
        label: '低损高频',
        desc: '采取风险控制措施',
        icon: 'icon:mingcute/currency-bitcoin-fill',
        illus: 'illus:coffee',
      },
      {
        label: '高损低频',
        desc: '通过保险转移风险',
        icon: 'icon:mingcute/dogecoin-doge-fill',
        illus: 'illus:diary',
      },
      {
        label: '低损低频',
        desc: '选择接受风险',
        icon: 'icon:mingcute/exchange-bitcoin-fill',
        illus: 'illus:invest',
      },
    ],
  },
  RELATION: {
    title: '子公司盈利分析',
    desc: '各子公司财务表现，盈利同比增长',
    items: [
      {
        icon: 'icon:mingcute/cardano-ada-fill',
        label: '云计算子公司',
        desc: '年度净利润率达25%，成为集团核心增长引擎',
        value: 25,
      },
      {
        icon: 'icon:mingcute/openai-fill',
        label: '人工智能子公司',
        desc: 'AI业务快速扩张，盈利同比增长40%',
        value: 40,
      },
      {
        icon: 'icon:mingcute/medium-fill',
        label: '物联网子公司',
        desc: 'IoT设备出货量突破千万，盈利稳步提升',
        value: 1000,
      },
      {
        icon: 'icon:mingcute/paypal-fill',
        label: '金融科技子公司',
        desc: '数字支付业务增长迅猛，净利润率18%',
        value: 18,
      },
      {
        icon: 'icon:mingcute/drone-fill',
        label: '新能源子公司',
        desc: '绿色能源项目实现规模化盈利，增长潜力巨大',
        value: 50,
      },
    ],
  },
};
