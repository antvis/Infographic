import type { TemplateOptions } from './types';

// 多样化的节点样式
const items = {
  'badge-card': {
    type: 'badge-card',
    width: 160,
    height: 60,
  },
  'compact-card': {
    type: 'compact-card',
    width: 180,
    height: 60,
  },
  'capsule-item': {
    type: 'capsule-item',
    width: 150,
    height: 60,
  },
  'rounded-rect-node': {
    type: 'rounded-rect-node',
    width: 140,
    height: 60,
  },
} as const;

// 基础结构属性
const baseStructureAttrs = {
  type: 'sequence-interaction',
  showLaneHeader: true,
  arrowType: 'triangle',
} as const;

// 箭头样式配置
const arrowStyles = {
  default: {},
  dashed: {
    edgeStyle: 'dashed',
  },
  animated: {
    edgeStyle: 'dashed',
    animated: true,
  },
} as const;

// 结构布局配置
const structures = {
  // 默认：带生命线
  default: {
    ...baseStructureAttrs,
    showLifeline: true,
    nodeGap: 60,
  },
  // 紧凑：更小间距
  compact: {
    ...baseStructureAttrs,
    showLifeline: true,
    nodeGap: 40,
  },
  // 宽松：更大间距
  wide: {
    ...baseStructureAttrs,
    showLifeline: true,
    nodeGap: 80,
  },
} as const;

export const sequenceInteractionTemplates: Record<string, TemplateOptions> = {};

// 排除某些不合适的组合
const omit: string[] = [
  // 后续如果有不合适的可以排除掉
];

Object.entries(structures).forEach(([strKey, strAttrs]) => {
  Object.entries(arrowStyles).forEach(([arrowKey, arrowAttrs]) => {
    Object.entries(items).forEach(([itemKey, itemAttrs]) => {
      const parts = [strKey];
      if (arrowKey !== 'default') {
        parts.push(arrowKey);
      }
      parts.push(itemKey);

      const appendix = parts.join('-');
      if (omit.includes(appendix)) return;

      const templateKey = `sequence-interaction-${appendix}`;

      sequenceInteractionTemplates[templateKey] = {
        design: {
          title: 'default',
          structure: {
            ...strAttrs,
            ...arrowAttrs,
          },
          item: itemAttrs,
        },
      };
    });
  });
});
