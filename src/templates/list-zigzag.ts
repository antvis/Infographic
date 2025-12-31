import type { TemplateOptions } from './types';

export const listZigzagTemplates: Record<string, TemplateOptions> = {
  'list-zigzag-up-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'list-zigzag-up',
      },
      items: [
        {
          type: 'compact-card',
        },
      ],
    },
    themeConfig: {
      colorPrimary: '#17CA2C',
    },
  },
  'list-zigzag-up-simple': {
    design: {
      title: 'default',
      structure: {
        type: 'list-zigzag-up',
      },
      items: [
        {
          type: 'simple',
          usePaletteColor: true,
        },
      ],
    },
    themeConfig: {
      colorPrimary: '#17CA2C',
    },
  },
  'list-zigzag-down-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'list-zigzag-down',
      },
      items: [
        {
          type: 'compact-card',
        },
      ],
    },
    themeConfig: {
      colorPrimary: '#17CA2C',
    },
  },
  'list-zigzag-down-simple': {
    design: {
      title: 'default',
      structure: {
        type: 'list-zigzag-down',
      },
      items: [
        {
          type: 'simple',
          usePaletteColor: true,
        },
      ],
    },
    themeConfig: {
      colorPrimary: '#17CA2C',
    },
  },
};
