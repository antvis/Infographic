import { registerTemplate } from '@antv/infographic';

registerTemplate('hierarchy-tree-badge-card', {
  design: { structure: 'hierarchy-tree', title: 'default', item: 'badge-card' },
});

registerTemplate('hierarchy-tree-rounded-rect-node', {
  design: {
    structure: 'hierarchy-tree',
    title: 'default',
    item: 'rounded-rect-node',
  },
});

registerTemplate('compare-hierarchy-left-right-circle-node-pill-badge', {
  design: {
    structure: {
      type: 'compare-hierarchy-left-right',
      decoration: 'split-line',
      surround: false,
      spacing: -20,
    },
    title: 'default',
    items: ['circle-node', 'pill-badge'],
  },
  themeConfig: {
    colorPrimary: '#5B8FF9',
  },
});
