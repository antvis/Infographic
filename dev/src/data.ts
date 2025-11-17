import { Data } from '@antv/infographic';

export const LIST_DATA: Data = {
  title: '产业布局',
  desc: '整合数据资产，构建标签画像体系，赋能数字化运营之路',
  items: [
    {
      icon: 'company-021_v1_lineal',
      label: '企业形象优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 80,
      time: '2018',
      illus: 'illus:english-teacher-bro-8693',
    },
    {
      icon: 'antenna-bars-5_v1_lineal',
      label: '综合实力优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 70,
      time: '2019',
      illus: 'illus:teacher-student-rafiki-9049',
    },
    {
      icon: 'achievment-050_v1_lineal',
      label: '企业营销优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 90,
      time: '2020',
      illus: 'illus:mathematics-cuate-7503',
    },
    {
      icon: '3d-file-015_v1_lineal',
      label: '产品定位优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 60,
      time: '2021',
      illus: 'illus:teacher-student-rafiki-9049',
    },
    {
      icon: 'activities-037_v1_lineal',
      label: '产品体验优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 80,
      time: '2022',
      illus: 'illus:english-teacher-bro-8693',
    },
    {
      icon: 'account-book-025_v1_lineal',
      label: '制造成本优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 90,
      time: '2023',
      illus: 'illus:mathematics-cuate-7503',
    },
    {
      icon: 'account-book-025_v1_lineal',
      label: '制造成本优势',
      desc: '产品优势详细说明产品优势详细说明',
      value: 97,
      time: '2024',
      illus: 'illus:english-teacher-bro-8693',
    },
  ],
};

export const HIERARCHY_DATA: Data = {
  title: '用户调研',
  desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
  items: [
    {
      label: '用户调研',
      // desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
      icon: '3d-file-015_v1_lineal',
      children: [
        {
          label: '用户为什么要使用某个音乐平台',
          desc: '用户为什么要使用某个音乐平台',
          icon: 'company-021_v1_lineal',
          children: [
            {
              label: '用户从哪些渠道了解到这个平台',
              icon: 'activities-037_v1_lineal',
            },
            {
              label: '这个平台是哪些方面吸引了用户',
              icon: 'activities-037_v1_lineal',
            },
          ],
        },
        {
          label: '用户在什么场景下使用这个平台',
          desc: '用户在什么场景下使用这个平台',
          icon: 'antenna-bars-5_v1_lineal',
          children: [
            {
              label: '用户从什么事件什么场景下使用',
              icon: 'account-book-025_v1_lineal',
            },
            {
              label: '用户在某个场景下用到哪些功能',
              icon: 'account-book-025_v1_lineal',
            },
          ],
        },
        {
          label: '用户什么原因下会离开这个平台',
          desc: '用户什么原因下会离开这个平台',
          icon: 'achievment-050_v1_lineal',
          children: [
            {
              label: '用户无法接受这个平台的原因',
              icon: 'account-book-025_v1_lineal',
            },
            {
              label: '用户觉得这个平台有哪些不足',
              icon: 'account-book-025_v1_lineal',
            },
          ],
        },
      ],
    },
  ],
};

export const COMPARE_DATA: Data = {
  title: '竞品分析',
  desc: '通过对比分析，找出差距，明确改进方向',
  items: [
    {
      label: '产品分析',
      children: [
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'company-021_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
      ],
    },
    {
      label: '竞品分析',
      children: [
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
        {
          icon: 'achievment-050_v1_lineal',
          label: '架构升级',
          desc: '品牌营销策略就是以品牌输出为核心的营销策略',
        },
      ],
    },
  ],
};

export const SWOT_DATA: Data = {
  title: 'SWOT分析',
  desc: '通过对比分析，找出差距，明确改进方向',
  items: [
    {
      // S
      label: 'Strengths',
      children: [
        { label: '强大的品牌影响力强大的品牌影响力' },
        { label: '丰富的产品线和服务' },
      ],
    },
    {
      // W
      label: 'Weaknesses',
      children: [
        { label: '市场份额有限' },
        { label: '品牌知名度较低' },
        { label: '技术创新能力不足' },
      ],
    },
    {
      // O
      label: 'Opportunities',
      children: [
        { label: '新兴市场的增长机会' },
        { label: '数字化转型的趋势' },
        { label: '战略合作伙伴关系的建立' },
      ],
    },
    {
      // T
      label: 'Threats',
      children: [
        { label: '激烈的市场竞争' },
        { label: '快速变化的消费者需求' },
        { label: '经济环境的不确定性' },
        { label: '技术进步带来的挑战' },
      ],
    },
  ],
};
