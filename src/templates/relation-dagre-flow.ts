import type { TemplateOptions } from './types';

const items = {
  'simple-circle-node': {
    type: 'simple-circle-node',
  },
  'badge-card': {
    type: 'badge-card',
  },
  capsule: {
    type: 'capsule-item',
  },
  'compact-card': {
    type: 'compact-card',
  },
} as const;

const baseStructureAttrs = {
  type: 'relation-dagre-flow',
  edgeColorMode: 'gradient',
  showArrow: true,
  arrowType: 'triangle',
  colorMode: 'node',
} as const;

const structures = {
  tb: {
    ...baseStructureAttrs,
    rankdir: 'TB',
    edgeRouting: 'orth',
  },
  lr: {
    ...baseStructureAttrs,
    rankdir: 'LR',
    edgeRouting: 'orth',
  },
  'tb-animated': {
    ...baseStructureAttrs,
    rankdir: 'TB',
    edgeCornerRadius: 12,
    edgeRouting: 'orth',
    edgeAnimation: 'ant-line',
    edgeDashPattern: '8,4',
    edgeAnimationSpeed: 1,
  },
  'lr-animated': {
    ...baseStructureAttrs,
    rankdir: 'LR',
    edgeCornerRadius: 12,
    edgeRouting: 'orth',
    edgeAnimation: 'ant-line',
    edgeDashPattern: '8,4',
    edgeAnimationSpeed: 1,
  },
};

export const relationDagreFlowTemplates: Record<string, TemplateOptions> = {};

const omit = ['lr-capsule', 'tb-capsule'];
Object.entries(structures).forEach(([strKey, strAttrs]) => {
  Object.entries(items).forEach(([itemKey, itemAttrs]) => {
    const appendix = `${strKey}-${itemKey}`;
    if (omit.includes(appendix)) return;
    const templateKey = `relation-dagre-flow-${appendix}`;
    relationDagreFlowTemplates[templateKey] = {
      design: {
        title: 'default',
        structure: strAttrs,
        item: itemAttrs,
      },
    };
  });
});
