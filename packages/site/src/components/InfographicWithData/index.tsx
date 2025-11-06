import { Data, InfographicOptions } from '@antv/infographic';
import Infographic from '../Infographic';

interface InfographicWithDemoProps {
  /** 信息图配置选项 */
  options: Partial<InfographicOptions>;
  /** demo 数据类型 */
  data?: string;
  /** 是否显示操作按钮 */
  showActions?: boolean;
}

/**
 * 带 Demo 数据的信息图组件
 * 基于 Infographic 组件封装，提供 data 字段来使用 demo 数据
 */
export default function InfographicWithDemo({
  options,
  data,
}: InfographicWithDemoProps) {
  const demoData = data ? DATA[data] : undefined;

  return (
    <Infographic
      options={{
        ...options,
        data: demoData,
      }}
    />
  );
}

const DATA: Record<string, Data> = {
  list: {
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
      {
        icon: 'icon:mingcute/car-fill',
        label: '制造成本优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 90,
        time: '2023',
        illus: 'illus:bus-stop',
      },
      {
        icon: 'icon:mingcute/compass-fill',
        label: '制造成本优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 97,
        time: '2024',
        illus: 'illus:by-the-road',
      },
    ],
  },
  hierarchy: {
    title: '用户调研',
    desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
    items: [
      {
        label: '用户调研',
        // desc: '通过用户调研，了解用户需求和痛点，指导产品设计和优化',
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
  compare: {
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
  swot: {
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
  },
};
