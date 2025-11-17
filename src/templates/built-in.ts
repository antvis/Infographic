import { hierarchyTreeTemplates } from './hierarchy-tree';
import { registerTemplate } from './registry';
import type { TemplateOptions } from './types';

const BUILT_IN_TEMPLATES: Record<string, TemplateOptions> = {
  'compare-hierarchy-left-right-circle-node-pill-badge': {
    design: {
      structure: {
        type: 'compare-hierarchy-left-right',
        decoration: 'split-line',
        surround: false,
        groupGap: -20,
      },
      title: 'default',
      items: [{ type: 'circle-node', width: 240 }, 'pill-badge'],
    },
    themeConfig: {},
  },
  'compare-hierarchy-left-right-circle-node-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-hierarchy-left-right',
        decoration: 'dot-line',
        flipLeaf: true,
        groupGap: -10,
      },
      items: [{ type: 'circle-node', width: 180 }, { type: 'plain-text' }],
    },
  },
  'list-pyramid-rounded-rect-node': {
    design: {
      title: 'default',
      structure: {
        type: 'list-pyramid',
      },
      items: [{ type: 'rounded-rect-node' }],
    },
  },
  'list-pyramid-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'list-pyramid' },
      items: [{ type: 'badge-card' }],
    },
  },
  'list-pyramid-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'list-pyramid' },
      items: [{ type: 'compact-card' }],
    },
  },
  'list-column-done-list': {
    design: {
      title: 'default',
      structure: { type: 'list-column' },
      items: [{ type: 'done-list' }],
    },
  },
  'list-column-vertical-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-column', gap: -5, zigzag: true },
      items: [{ type: 'vertical-icon-arrow' }],
    },
  },
  'list-grid-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'badge-card' }],
    },
  },
  'list-grid-candy-card-lite': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'candy-card-lite' }],
    },
  },
  'chart-column-simple': {
    design: {
      title: 'default',
      structure: { type: 'chart-column' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'list-grid-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'circular-progress' }],
    },
  },
  'list-grid-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'compact-card' }],
    },
  },
  'list-grid-done-list': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'done-list' }],
    },
  },
  'list-grid-horizontal-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 0, zigzag: true },
      items: [{ type: 'horizontal-icon-arrow' }],
    },
  },
  'list-grid-progress-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'progress-card' }],
    },
  },
  'list-grid-ribbon-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'ribbon-card' }],
    },
  },
  'list-grid-simple': {
    design: {
      title: 'default',
      structure: { type: 'list-grid' },
      items: [{ type: 'simple' }],
    },
  },
  'list-row-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'list-row' },
      items: [{ type: 'circular-progress' }],
    },
  },
  'list-row-horizontal-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 0, zigzag: true },
      items: [{ type: 'horizontal-icon-arrow' }],
    },
  },
  'relation-circle-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'relation-circle' },
      items: [{ type: 'circular-progress' }],
    },
  },
  'relation-circle-icon-badge': {
    design: {
      title: 'default',
      structure: { type: 'relation-circle' },
      items: [{ type: 'icon-badge' }],
    },
  },
  'sequence-steps-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps' },
      items: [{ type: 'badge-card' }],
    },
  },
  'sequence-steps-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps', gap: 10 },
      items: [{ type: 'simple' }],
    },
  },
  'sequence-timeline-done-list': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline' },
      items: [{ type: 'done-list' }],
    },
  },
  'sequence-timeline-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline' },
      items: [{ type: 'plain-text' }],
    },
  },
  'sequence-timeline-rounded-rect-node': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline' },
      items: [{ type: 'rounded-rect-node' }],
    },
  },
  'sequence-ascending-steps': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-steps', vGap: -46, hGap: -20 },
      items: [{ type: 'l-corner-card' }],
    },
  },
  'sequence-timeline-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 20 },
      items: [{ type: 'simple' }],
    },
  },
  'sequence-cylinders-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-cylinders-3d', gapY: 20 },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'list-column-simple-vertical-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-column', gap: 0, zigzag: true },
      items: [{ type: 'simple-vertical-arrow' }],
    },
  },
  'list-row-simple-horizontal-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 0, zigzag: true },
      items: [{ type: 'simple-horizontal-arrow' }],
    },
  },
  'compare-swot': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-hierarchy-row',
        itemGap: 32,
        itemPadding: 40,
        showColumnBackground: true,
        columnBackgroundAlpha: 0.08,
      },
      items: [
        { type: 'letter-card', showBottomShade: false },
        {
          type: 'plain-text',
          formatter: (text: string) => `● ${text}`,
          usePaletteColor: true,
        },
      ],
    },
  },
  'compare-hierarchy-row-letter-card-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'compare-hierarchy-row' },
      items: [{ type: 'letter-card' }, { type: 'compact-card' }],
    },
  },
  'compare-hierarchy-row-letter-card-rounded-rect-node': {
    design: {
      title: 'default',
      structure: { type: 'compare-hierarchy-row' },
      items: [{ type: 'letter-card' }, { type: 'rounded-rect-node' }],
    },
  },
  'sequence-snake-steps-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps' },
      items: [{ type: 'compact-card' }],
    },
  },
  'sequence-snake-steps-pill-badge': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps' },
      items: [{ type: 'pill-badge' }],
    },
  },
  'sequence-snake-steps-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps' },
      items: [{ type: 'simple' }],
    },
  },
  'sequence-color-snake-steps-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'sequence-color-snake-steps' },
      items: [{ type: 'horizontal-icon-line' }],
    },
  },
  'sequence-pyramid-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-pyramid' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'list-row-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 0, zigzag: true },
      items: [{ type: 'horizontal-icon-line' }],
    },
  },
  'list-sector-simple': {
    design: {
      title: 'default',
      structure: { type: 'list-sector' },
      items: [{ type: 'simple' }],
    },
  },
  'list-sector-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'list-sector' },
      items: [{ type: 'plain-text' }],
    },
  },
  'list-sector-half-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'list-sector', startAngle: -180, endAngle: 0 },
      items: [{ type: 'plain-text' }],
    },
  },
  'quadrant-quarter-simple-card': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'quarter-simple-card' }],
    },
  },
  'quadrant-quarter-circular': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'quarter-circular' }],
    },
  },
  'sequence-roadmap-vertical-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'plain-text' }],
    },
  },
  'sequence-roadmap-vertical-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'simple', showIcon: false }],
    },
  },
  'sequence-roadmap-vertical-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'badge-card' }],
    },
  },
  'sequence-roadmap-vertical-pill-badge': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'pill-badge' }],
    },
  },
  'sequence-roadmap-vertical-quarter-circular': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'quarter-circular' }],
    },
  },
  'sequence-roadmap-vertical-quarter-simple-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', flipped: true },
      items: [{ type: 'quarter-simple-card' }],
    },
  },
  'sequence-horizontal-zigzag-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'sequence-horizontal-zigzag-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'horizontal-icon-line' }],
    },
  },
  'sequence-horizontal-zigzag-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'plain-text' }],
    },
  },
  'sequence-horizontal-zigzag-simple-horizontal-arrow': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'simple-horizontal-arrow' }],
    },
  },
  'sequence-horizontal-zigzag-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'simple' }],
    },
  },
  'list-row-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'list-row' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'quadrant-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'sequence-color-snake-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-color-snake-steps' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'sequence-snake-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'sequence-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps' },
      items: [{ type: 'simple-illus' }],
    },
  },
  'sequence-timeline-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline' },
      items: [{ type: 'simple-illus', usePaletteColor: true }],
    },
  },
  'sequence-zigzag-steps-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-steps' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-horizontal-zigzag-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-roadmap-vertical-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-snake-steps-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-circle-arrows-indexed-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circle-arrows' },
      items: [{ type: 'indexed-card' }],
    },
  },
  'sequence-zigzag-pucks-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-zigzag-pucks-3d-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-zigzag-pucks-3d-indexed-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d' },
      items: [{ type: 'indexed-card' }],
    },
  },
  'sequence-ascending-stairs-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-stairs-3d' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-ascending-stairs-3d-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-stairs-3d' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-circular-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circular' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-circular-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circular' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-filter-mesh-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-filter-mesh' },
      items: [{ type: 'underline-text' }],
    },
  },
  'sequence-filter-mesh-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-filter-mesh' },
      items: [{ type: 'simple', showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-mountain-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-mountain' },
      items: [{ type: 'underline-text' }],
    },
  },
  'compare-binary-horizontal-simple-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
      },
      items: [{ type: 'simple', iconType: 'circle', iconSize: 40 }],
    },
  },
  'compare-binary-horizontal-underline-text-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
      },
      items: [{ type: 'underline-text' }],
    },
  },
  'compare-binary-horizontal-badge-card-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
      },
      items: [{ type: 'badge-card' }],
    },
  },
  'compare-binary-horizontal-compact-card-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
      },
      items: [{ type: 'compact-card' }],
    },
  },
  'compare-binary-horizontal-simple-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
      },
      items: [{ type: 'simple', iconType: 'circle', iconSize: 40 }],
    },
  },
  'compare-binary-horizontal-underline-text-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
      },
      items: [{ type: 'underline-text' }],
    },
  },
  'compare-binary-horizontal-badge-card-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
      },
      items: [{ type: 'badge-card' }],
    },
  },
  'compare-binary-horizontal-compact-card-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
      },
      items: [{ type: 'compact-card' }],
    },
  },
  'compare-binary-horizontal-simple-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
      },
      items: [{ type: 'simple', iconType: 'circle', iconSize: 40 }],
    },
  },
  'compare-binary-horizontal-underline-text-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
      },
      items: [{ type: 'underline-text' }],
    },
  },
  'compare-binary-horizontal-badge-card-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
      },
      items: [{ type: 'badge-card' }],
    },
  },
  'compare-binary-horizontal-compact-card-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
      },
      items: [{ type: 'compact-card' }],
    },
  },
  ...hierarchyTreeTemplates,
};

Object.entries(BUILT_IN_TEMPLATES).forEach(([name, options]) => {
  registerTemplate(name, options);
});
