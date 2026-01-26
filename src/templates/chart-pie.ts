import type { TemplateOptions } from './types';

export const chartPieTemplates: Record<string, TemplateOptions> = {
  'chart-pie-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
      },
      items: [
        {
          type: 'plain-text',
        },
      ],
    },
  },
  'chart-pie-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
      },
      items: [
        {
          type: 'compact-card',
        },
      ],
    },
  },
  'chart-pie-pill-badge': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
      },
      items: [
        {
          type: 'pill-badge',
        },
      ],
    },
  },
  'chart-pie-donut-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
      },
      items: [
        {
          type: 'plain-text',
        },
      ],
    },
  },
  'chart-pie-donut-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
      },
      items: [
        {
          type: 'compact-card',
        },
      ],
    },
  },
  'chart-pie-donut-pill-badge': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
      },
      items: [
        {
          type: 'pill-badge',
        },
      ],
    },
  },
};
