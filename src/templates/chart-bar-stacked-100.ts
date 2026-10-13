import type { TemplateOptions } from './types';

export const chartBarStacked100Templates: Record<string, TemplateOptions> = {
  'chart-bar-stacked-100-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'chart-bar-stacked-100' },
      item: { type: 'plain-text', width: 180, lineNumber: 2 },
    },
    themeConfig: { palette: 'antv' },
  },
};
