import type { TemplateOptions } from './types';

export const hierarchyStructureTemplates: Record<string, TemplateOptions> = {
  'hierarchy-structure': {
    design: {
      title: 'default',
      structure: {
        type: 'hierarchy-structure',
      },
      item: 'simple',
    },
  },
  'hierarchy-structure-mirror': {
    design: {
      title: 'default',
      structure: {
        type: 'hierarchy-structure',
        layerLabelPosition: 'right',
      },
      item: 'simple',
    },
  },
};
