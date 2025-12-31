import {DATASET} from './datasets';

export type GalleryTemplate = {
  template: string;
  syntax: string;
};

const COMMON_THEME = {
  type: 'light',
  palette: 'antv',
} as const;

const DATA_KEY_ORDER = ['title', 'desc', 'items'] as const;
const ITEM_KEY_ORDER = [
  'label',
  'value',
  'desc',
  'time',
  'icon',
  'illus',
  'children',
] as const;
const INLINE_ITEM_KEYS = ['label', 'value', 'time', 'desc'] as const;
const INDENT = '  ';

const orderKeys = (obj: Record<string, any>, preferred: readonly string[]) => {
  const ordered: string[] = [];
  const preferredSet = new Set(preferred);
  preferred.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ordered.push(key);
    }
  });
  Object.keys(obj)
    .filter((key) => !preferredSet.has(key))
    .sort()
    .forEach((key) => ordered.push(key));
  return ordered;
};

const stringifyScalar = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return String(value);
};

function stringifyArray(items: any[], indentLevel: number) {
  const lines: string[] = [];
  const indent = INDENT.repeat(indentLevel);

  items.forEach((item) => {
    if (item === undefined || item === null) return;

    if (Array.isArray(item)) {
      lines.push(`${indent}- ${item.map(stringifyScalar).join(' ')}`);
      return;
    }

    if (typeof item === 'object') {
      const record = item as Record<string, any>;
      const inlineKey = INLINE_ITEM_KEYS.find(
        (key) =>
          record[key] !== undefined &&
          record[key] !== null &&
          typeof record[key] !== 'object'
      );
      if (inlineKey) {
        lines.push(
          `${indent}- ${inlineKey} ${stringifyScalar(record[inlineKey])}`
        );
      } else {
        lines.push(`${indent}-`);
      }
      const omit = inlineKey ? new Set([inlineKey]) : new Set<string>();
      const nested = stringifyObject(
        record,
        indentLevel + 1,
        ITEM_KEY_ORDER,
        omit
      );
      if (nested.length) {
        lines.push(...nested);
      }
      return;
    }

    lines.push(`${indent}- ${stringifyScalar(item)}`);
  });

  return lines;
}

function stringifyObject(
  obj: Record<string, any>,
  indentLevel: number,
  keyOrder: readonly string[],
  omitKeys: Set<string> = new Set()
) {
  const lines: string[] = [];
  const indent = INDENT.repeat(indentLevel);
  const keys = orderKeys(obj, keyOrder);

  keys.forEach((key) => {
    if (omitKeys.has(key)) return;
    const value = obj[key];
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      lines.push(`${indent}${key}`);
      lines.push(...stringifyArray(value, indentLevel + 1));
      return;
    }

    if (typeof value === 'object') {
      const nested = stringifyObject(value, indentLevel + 1, []);
      if (nested.length === 0) return;
      lines.push(`${indent}${key}`);
      lines.push(...nested);
      return;
    }

    lines.push(`${indent}${key} ${stringifyScalar(value)}`);
  });

  return lines;
}

const buildSyntax = (template: string, data: Record<string, any>) => {
  const lines: string[] = [`infographic ${template}`];
  if (data && Object.keys(data).length > 0) {
    lines.push('data');
    lines.push(...stringifyObject(data, 1, DATA_KEY_ORDER));
  }
  lines.push(`theme ${COMMON_THEME.type}`);
  lines.push(`${INDENT}palette ${COMMON_THEME.palette}`);
  return lines.join('\n');
};

const HIERARCHY_TREE_STRUCTURES = [
  'tech-style',
  'dashed-line',
  'distributed-origin',
  'curved-line',
  'dashed-arrow',
] as const;
const HIERARCHY_TREE_ITEMS = [
  'capsule-item',
  'rounded-rect-node',
  'compact-card',
  'badge-card',
  'ribbon-card',
] as const;
const HIERARCHY_TREE_ORIENTATIONS = ['bt', 'lr', 'rl'] as const;

const buildHierarchyTreeOrientationEntries = (): [string, any][] =>
  HIERARCHY_TREE_ORIENTATIONS.flatMap((ori) =>
    HIERARCHY_TREE_STRUCTURES.flatMap((structure) =>
      HIERARCHY_TREE_ITEMS.map(
        (item) =>
          [`hierarchy-tree-${ori}-${structure}-${item}`, DATASET.HIERARCHY] as [
            string,
            any
          ]
      )
    )
  );

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
  ['list-zigzag-down-compact-card', DATASET.LIST],
  ['list-zigzag-down-simple', DATASET.LIST],
  ['list-zigzag-up-compact-card', DATASET.LIST],
  ['list-zigzag-up-simple', DATASET.LIST],
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
  ['hierarchy-mindmap-branch-gradient-lined-palette', DATASET.HIERARCHY],
  ['hierarchy-mindmap-level-gradient-lined-palette', DATASET.HIERARCHY],
  ['hierarchy-mindmap-branch-gradient-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-mindmap-level-gradient-capsule-item', DATASET.HIERARCHY],
  ['hierarchy-mindmap-branch-gradient-circle-progress', DATASET.HIERARCHY],
  ['hierarchy-mindmap-level-gradient-circle-progress', DATASET.HIERARCHY],
  ['hierarchy-mindmap-branch-gradient-rounded-rect', DATASET.HIERARCHY],
  ['hierarchy-mindmap-level-gradient-rounded-rect', DATASET.HIERARCHY],
  ['hierarchy-mindmap-branch-gradient-compact-card', DATASET.HIERARCHY],
  ['hierarchy-mindmap-level-gradient-compact-card', DATASET.HIERARCHY],
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
  ...buildHierarchyTreeOrientationEntries(),
  ['sequence-stairs-front-pill-badge', DATASET.LIST],
  ['sequence-stairs-front-compact-card', DATASET.LIST],
  ['sequence-stairs-front-simple', DATASET.LIST],
  ['chart-wordcloud', DATASET.WORD_CLOUD],
  ['chart-wordcloud-rotate', DATASET.WORD_CLOUD],
];

// 4. 核心逻辑：分类与排序
// 使用 Map 提高查找效率，避免多次遍历数组
const allTemplatesMap = new Map(
  TEMPLATE_ENTRIES.map(([template, data]) => [
    template,
    buildSyntax(template, data),
  ])
);

// 4.1 提取 Premium 模版 (按指定顺序)
const premiumTemplates = PREMIUM_TEMPLATE_KEYS.map((key) => {
  const syntax = allTemplatesMap.get(key);
  if (syntax) {
    allTemplatesMap.delete(key);
    return {template: key, syntax};
  }
  return null;
}).filter(Boolean) as GalleryTemplate[];

// 4.2 提取 Normal 模版 (剩余的按字母顺序排序)
const normalTemplates = Array.from(allTemplatesMap.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([template, syntax]) => ({template, syntax}));

// 5. 导出结果
export const TEMPLATES: GalleryTemplate[] = [
  ...premiumTemplates,
  ...normalTemplates,
];
