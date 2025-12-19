import type { TemplateOptions } from './types';

export const wordCloudTemplate: Record<string, TemplateOptions> = {
  'chart-wordcloud-rotate': {
    design: {
      structure: {
        type: 'chart-wordcloud',
      },
      item: 'simple',
    },
  },
  'chart-wordcloud': {
    design: {
      structure: {
        type: 'chart-wordcloud',
        enableRotate: false,
      },
      item: 'simple',
    },
  },
};
