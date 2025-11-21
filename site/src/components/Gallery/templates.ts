import {InfographicOptions} from '@antv/infographic';
import {partition} from 'lodash-es';
import {DATASET} from './datasets';

export const PREMIUM_TEMPLATE_KEYS: string[] = [
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

export const BUILTIN_TEMPLATES: InfographicOptions[] = [
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-hierarchy-left-right-circle-node-pill-badge',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-hierarchy-left-right-circle-node-plain-text',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-swot',
    data: DATASET.SWOT,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-simple-fold',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-hierarchy-row-letter-card-compact-card',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-underline-text-fold',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-underline-text-arrow',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-compact-card-arrow',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-badge-card-vs',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'compare-binary-horizontal-compact-card-vs',
    data: DATASET.COMPARE,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-pyramid-rounded-rect-node',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-pyramid-badge-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-pyramid-compact-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-column-done-list',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-column-vertical-icon-arrow',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-badge-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-candy-card-lite',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-circular-progress',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-compact-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-done-list',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-progress-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-horizontal-icon-arrow',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-ribbon-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-grid-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-row-circular-progress',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-row-horizontal-icon-arrow',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-column-simple-vertical-arrow',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-row-simple-horizontal-arrow',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-row-horizontal-icon-line',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-sector-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-sector-plain-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-sector-half-plain-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'list-row-simple-illus',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'chart-column-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'relation-circle-circular-progress',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'relation-circle-icon-badge',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-steps-badge-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-steps-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-timeline-done-list',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-timeline-plain-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-timeline-rounded-rect-node',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-ascending-steps',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-timeline-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-cylinders-3d-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-snake-steps-compact-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-snake-steps-pill-badge',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-snake-steps-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-color-snake-steps-horizontal-icon-line',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-pyramid-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-roadmap-vertical-plain-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-roadmap-vertical-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-roadmap-vertical-pill-badge',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-horizontal-zigzag-simple-illus',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-horizontal-zigzag-plain-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-horizontal-zigzag-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-steps-simple-illus',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-timeline-simple-illus',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-zigzag-steps-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-horizontal-zigzag-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-roadmap-vertical-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-snake-steps-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-zigzag-pucks-3d-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-circle-arrows-indexed-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-zigzag-pucks-3d-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-ascending-stairs-3d-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-ascending-stairs-3d-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-circular-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-circular-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-filter-mesh-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-filter-mesh-simple',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'sequence-mountain-underline-text',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'quadrant-quarter-simple-card',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'quadrant-quarter-circular',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'quadrant-simple-illus',
    data: DATASET.LIST,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-tech-style-capsule-item',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-line-capsule-item',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-capsule-item',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-curved-line-capsule-item',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-arrow-capsule-item',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-tech-style-rounded-rect-node',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-line-rounded-rect-node',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-rounded-rect-node',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-curved-line-rounded-rect-node',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-arrow-rounded-rect-node',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-tech-style-compact-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-line-compact-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-compact-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-curved-line-compact-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-arrow-compact-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-tech-style-badge-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-line-badge-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-badge-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-curved-line-badge-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-arrow-badge-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-tech-style-ribbon-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-line-ribbon-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-ribbon-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-distributed-origin-ribbon-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-dashed-arrow-ribbon-card',
    data: DATASET.HIERARCHY,
  },
  {
    theme: 'light',
    themeConfig: {
      palette: 'antv',
    },
    template: 'hierarchy-tree-curved-line-ribbon-card',
    data: DATASET.HIERARCHY,
  },
];

const [premiumUnsorted, normalUnsorted] = partition(BUILTIN_TEMPLATES, (t) =>
  PREMIUM_TEMPLATE_KEYS.includes(t.template || '')
);

const premium = PREMIUM_TEMPLATE_KEYS.map((key) =>
  premiumUnsorted.find((t) => t.template === key)
).filter(Boolean) as InfographicOptions[];

const normal = normalUnsorted.sort((a, b) => {
  const titleA = a.template || '';
  const titleB = b.template || '';
  return titleA.localeCompare(titleB);
});

export const TEMPLATES: InfographicOptions[] = [...premium, ...normal];
