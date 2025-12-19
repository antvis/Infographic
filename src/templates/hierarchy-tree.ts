import type { HierarchyTreeProps, TemplateOptions } from '../designs';

const structures: Record<string, Partial<HierarchyTreeProps>> = {
  'tech-style': {
    edgeType: 'straight',
    edgeStyle: 'solid',
    edgeColorMode: 'gradient',
    edgeMarker: 'arrow',
    markerSize: 12,
    edgeCornerRadius: 5,
  },
  'dashed-line': {
    edgeStyle: 'dashed',
    edgeCornerRadius: 10,
    edgeDashPattern: '10,5',
    edgeColorMode: 'gradient',
    edgeMarker: 'dot',
    markerSize: 6,
    edgeOffset: 6,
  },
  'distributed-origin': {
    edgeOrigin: 'distributed',
    edgeOriginPadding: 30,
    edgeMarker: 'arrow',
    edgeCornerRadius: 10,
    markerSize: 12,
    edgeColorMode: 'gradient',
  },
  'curved-line': {
    edgeType: 'curved',
    edgeColorMode: 'gradient',
    edgeMarker: 'none',
  },
  'dashed-arrow': {
    edgeType: 'straight',
    edgeStyle: 'dashed',
    edgeDashPattern: '8,4',
    edgeMarker: 'arrow',
    markerSize: 10,
    edgeCornerRadius: 0,
  },
};

const items: string[] = [
  'capsule-item',
  'rounded-rect-node',
  'compact-card',
  'badge-card',
  'ribbon-card',
];

export const hierarchyTreeTemplates: Record<string, TemplateOptions> = {};

const structureName = 'hierarchy-tree';
const orientationConfigs: Array<{
  key: string;
  orientation?: HierarchyTreeProps['orientation'];
}> = [
  { key: '' },
  { key: 'bt', orientation: 'bottom-top' },
  { key: 'lr', orientation: 'left-right' },
  { key: 'rl', orientation: 'right-left' },
];

const createTemplateName = (
  oriKey: string,
  name: string,
  item: string,
): string => {
  return oriKey
    ? `${structureName}-${oriKey}-${name}-${item}`
    : `${structureName}-${name}-${item}`;
};

for (const item of items) {
  for (const [name, structureProps] of Object.entries(structures)) {
    for (const { key, orientation } of orientationConfigs) {
      const templateName = createTemplateName(key, name, item);
      hierarchyTreeTemplates[templateName] = {
        design: {
          structure: {
            type: 'hierarchy-tree',
            ...(orientation ? { orientation } : {}),
            ...structureProps,
          },
          item: {
            type: item,
          },
        },
      };
    }
  }
}
