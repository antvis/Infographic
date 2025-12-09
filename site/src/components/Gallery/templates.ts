import {InfographicOptions} from '@antv/infographic';
import {DATASET} from './datasets';

// 1. 提取公共配置，避免重复
const COMMON_OPTIONS = {
  theme: 'light',
  themeConfig: {
    palette: 'antv',
  },
  padding: 20,
} as const;

// 2. 定义 Premium 模版顺序 (保持不变)
const PREMIUM_TEMPLATE_KEYS = [
  'sequence-zigzag-steps-underline-text',
  'sequence-horizontal-zigzag-underline-text',
  'sequence-circular-simple',
  'sequence-filter-mesh-simple',
  'sequence-mountain-underline-text',
  'sequence-cylinders-3d-simple',
  'compare-binary-horizontal-simple-fold',
  'compare-hierarchy-left-right-circle-node-pill-badge',
  'quadrant-quarter-simple-card',
  'quadrant-quarter-circular',
  'list-grid-badge-card',
  'list-grid-candy-card-lite',
  'list-grid-ribbon-card',
  'list-row-horizontal-icon-arrow',
  'relation-circle-icon-badge',
  'sequence-ascending-steps',
  'compare-swot',
  'sequence-color-snake-steps-horizontal-icon-line',
  'sequence-pyramid-simple',
  'list-sector-plain-text',
  'sequence-roadmap-vertical-simple',
  'sequence-zigzag-pucks-3d-simple',
  'sequence-ascending-stairs-3d-underline-text',
  'compare-binary-horizontal-badge-card-arrow',
  'compare-binary-horizontal-underline-text-vs',
  'hierarchy-tree-tech-style-capsule-item',
  'hierarchy-tree-curved-line-rounded-rect-node',
  'hierarchy-tree-tech-style-badge-card',
];

// 3. 定义模版与数据的映射关系
// 使用元组 [TemplateID, Dataset] 极大精简代码体积
const TEMPLATE_ENTRIES: [string, any][] = [
  ['compare-hierarchy-left-right-circle-node-pill-badge', DATASET.PROS_CONS],
  ['compare-hierarchy-left-right-circle-node-plain-text', DATASET.PROS_CONS],
  ['compare-swot', DATASET.SWOT],
  ['compare-binary-horizontal-simple-fold', DATASET.PROS_CONS],
  ['compare-hierarchy-row-letter-card-compact-card', DATASET.PROS_CONS],
  ['compare-binary-horizontal-underline-text-fold', DATASET.PROS_CONS],
  ['compare-binary-horizontal-underline-text-arrow', DATASET.PROS_CONS],
  ['compare-binary-horizontal-compact-card-arrow', DATASET.PROS_CONS],
  ['compare-binary-horizontal-badge-card-vs', DATASET.PROS_CONS],
  ['compare-binary-horizontal-compact-card-vs', DATASET.PROS_CONS],
  ['chart-bar-plain-text', DATASET.CHART],
  ['chart-line-plain-text', DATASET.CHART],
  ['chart-pie-plain-text', DATASET.CHART],
  ['chart-pie-compact-card', DATASET.CHART],
  ['chart-pie-pill-badge', DATASET.CHART],
  ['chart-pie-donut-plain-text', DATASET.CHART],
  ['chart-pie-donut-compact-card', DATASET.CHART],
  ['chart-pie-donut-pill-badge', DATASET.CHART],
  ['list-pyramid-rounded-rect-node', DATASET.LIST],
  ['list-pyramid-badge-card', DATASET.LIST],
  ['list-pyramid-compact-card', DATASET.LIST],
  ['list-column-done-list', DATASET.LIST],
  ['list-column-vertical-icon-arrow', DATASET.TIMELINE],
  ['list-grid-badge-card', DATASET.LIST],
  ['list-grid-candy-card-lite', DATASET.LIST],
  ['list-grid-circular-progress', DATASET.LIST],
  ['list-grid-compact-card', DATASET.LIST],
  ['list-grid-done-list', DATASET.LIST],
  ['list-grid-progress-card', DATASET.LIST],
  ['list-grid-horizontal-icon-arrow', DATASET.LIST],
  ['list-grid-ribbon-card', DATASET.LIST],
  ['list-grid-simple', DATASET.LIST],
  ['list-row-circular-progress', DATASET.LIST],
  ['list-row-horizontal-icon-arrow', DATASET.LIST],
  ['list-column-simple-vertical-arrow', DATASET.TIMELINE],
  ['list-row-simple-horizontal-arrow', DATASET.LIST],
  ['list-row-horizontal-icon-line', DATASET.LIST],
  ['list-sector-simple', DATASET.LIST],
  ['list-sector-plain-text', DATASET.LIST],
  ['list-sector-half-plain-text', DATASET.LIST],
  ['list-row-simple-illus', DATASET.LIST],
  ['chart-column-simple', DATASET.CHART],
  ['relation-circle-circular-progress', DATASET.RELATION],
  ['relation-circle-icon-badge', DATASET.RELATION],
  ['sequence-steps-badge-card', DATASET.LIST],
  ['sequence-steps-simple', DATASET.LIST],
  ['sequence-timeline-done-list', DATASET.LIST],
  ['sequence-timeline-plain-text', DATASET.LIST],
  ['sequence-timeline-rounded-rect-node', DATASET.LIST],
  ['sequence-ascending-steps', DATASET.LIST],
  ['sequence-timeline-simple', DATASET.LIST],
  ['sequence-cylinders-3d-simple', DATASET.LIST],
  ['sequence-snake-steps-compact-card', DATASET.LIST],
  ['sequence-snake-steps-pill-badge', DATASET.LIST],
  ['sequence-snake-steps-simple', DATASET.LIST],
  ['sequence-color-snake-steps-horizontal-icon-line', DATASET.LIST],
  ['sequence-pyramid-simple', DATASET.LIST],
  ['sequence-roadmap-vertical-plain-text', DATASET.LIST],
  ['sequence-roadmap-vertical-simple', DATASET.LIST],
  ['sequence-roadmap-vertical-pill-badge', DATASET.LIST],
  ['sequence-horizontal-zigzag-simple-illus', DATASET.LIST],
  ['sequence-horizontal-zigzag-plain-text', DATASET.LIST],
  ['sequence-horizontal-zigzag-simple', DATASET.LIST],
  ['sequence-steps-simple-illus', DATASET.LIST],
  ['sequence-timeline-simple-illus', DATASET.LIST],
  ['sequence-zigzag-steps-underline-text', DATASET.LIST],
  ['sequence-horizontal-zigzag-underline-text', DATASET.LIST],
  ['sequence-roadmap-vertical-underline-text', DATASET.LIST],
  ['sequence-snake-steps-underline-text', DATASET.LIST],
  ['sequence-zigzag-pucks-3d-simple', DATASET.LIST],
  ['sequence-circle-arrows-indexed-card', DATASET.LIST],
  ['sequence-zigzag-pucks-3d-underline-text', DATASET.LIST],
  ['sequence-ascending-stairs-3d-simple', DATASET.LIST],
  ['sequence-ascending-stairs-3d-underline-text', DATASET.LIST],
  ['sequence-circular-underline-text', DATASET.LIST],
  ['sequence-circular-simple', DATASET.LIST],
  ['sequence-filter-mesh-underline-text', DATASET.LIST],
  ['sequence-filter-mesh-simple', DATASET.LIST],
  ['sequence-mountain-underline-text', DATASET.LIST],
  ['quadrant-quarter-simple-card', DATASET.QUADRANT],
  ['quadrant-quarter-circular', DATASET.QUADRANT],
  ['quadrant-simple-illus', DATASET.QUADRANT],
  ['hierarchy-tree-tech-style-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-line-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-tree-distributed-origin-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-tree-curved-line-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-arrow-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-tree-tech-style-rounded-rect-node', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-line-rounded-rect-node', DATASET.HIERARCHY],
  ['hierarchy-tree-distributed-origin-rounded-rect-node', DATASET.HIERARCHY],
  ['hierarchy-tree-curved-line-rounded-rect-node', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-arrow-rounded-rect-node', DATASET.HIERARCHY],
  ['hierarchy-tree-tech-style-compact-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-line-compact-card', DATASET.HIERARCHY],
  ['hierarchy-tree-distributed-origin-compact-card', DATASET.HIERARCHY],
  ['hierarchy-tree-curved-line-compact-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-arrow-compact-card', DATASET.HIERARCHY],
  ['hierarchy-tree-tech-style-badge-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-line-badge-card', DATASET.HIERARCHY],
  ['hierarchy-tree-distributed-origin-badge-card', DATASET.HIERARCHY],
  ['hierarchy-tree-curved-line-badge-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-arrow-badge-card', DATASET.HIERARCHY],
  ['hierarchy-tree-tech-style-ribbon-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-line-ribbon-card', DATASET.HIERARCHY],
  ['hierarchy-tree-distributed-origin-ribbon-card', DATASET.HIERARCHY],
  ['hierarchy-tree-dashed-arrow-ribbon-card', DATASET.HIERARCHY],
  ['hierarchy-tree-curved-line-ribbon-card', DATASET.HIERARCHY],
];

// 4. 构建完整对象列表
// 辅助函数：将元组转换为完整的 InfographicOptions 对象
const createOption = ([template, data]: [string, any]): InfographicOptions => ({
  ...COMMON_OPTIONS,
  template,
  data,
});

// 5. 核心逻辑：分类与排序
// 使用 Map 提高查找效率，避免多次遍历数组
const allTemplatesMap = new Map(
  TEMPLATE_ENTRIES.map((entry) => [entry[0], createOption(entry)])
);

// 5.1 提取 Premium 模版 (按指定顺序)
const premiumTemplates = PREMIUM_TEMPLATE_KEYS.map((key) => {
  const template = allTemplatesMap.get(key);
  if (template) {
    allTemplatesMap.delete(key); // 取出后从 Map 中删除，剩下的即为 Normal
    return template;
  }
  return null;
}).filter(Boolean) as InfographicOptions[];

// 5.2 提取 Normal 模版 (剩余的按字母顺序排序)
const normalTemplates = Array.from(allTemplatesMap.values()).sort((a, b) => {
  const titleA = a.template || '';
  const titleB = b.template || '';
  return titleA.localeCompare(titleB);
});

// 6. 导出结果
export const BUILTIN_TEMPLATES: InfographicOptions[] =
  TEMPLATE_ENTRIES.map(createOption);

export const TEMPLATES: InfographicOptions[] = [
  ...premiumTemplates,
  ...normalTemplates,
];
