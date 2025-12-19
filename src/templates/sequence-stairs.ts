import type { TemplateOptions } from './types';

export const sequenceStairsTemplates: Record<string, TemplateOptions> = {
  'sequence-stairs-front-pill-badge': {
    design: {
      title: 'default',
      structure: {
        type: 'sequence-stairs-front',
      },
      items: [
        {
          type: 'pill-badge',
        },
      ],
    },
  },
  'sequence-stairs-front-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'sequence-stairs-front',
      },
      items: [
        {
          type: 'compact-card',
        },
      ],
    },
  },
  'sequence-stairs-front-simple': {
    design: {
      title: 'default',
      structure: {
        type: 'sequence-stairs-front',
      },
      items: [
        {
          type: 'simple',
          usePaletteColor: true,
        },
      ],
    },
  },
};
