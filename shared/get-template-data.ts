import { DATASET } from './datasets';

export type TemplateData = (typeof DATASET)[keyof typeof DATASET];

export const getDataByTemplate = (
  template: string | undefined,
): TemplateData => {
  if (!template) return DATASET.LIST;
  if (template.startsWith('hierarchy-structure')) {
    return DATASET.HIERARCHY_STRUCTURE;
  }
  if (template.startsWith('hierarchy-')) {
    return DATASET.HIERARCHY;
  }
  if (template.startsWith('compare-swot')) {
    return DATASET.SWOT;
  }
  if (template.startsWith('compare-binary')) {
    return DATASET.PROS_CONS;
  }
  if (template.startsWith('compare-')) {
    if (template.includes('quadrant')) {
      return DATASET.QUADRANT;
    }
    return DATASET.COMPARE;
  }
  if (template.startsWith('chart-wordcloud')) {
    return DATASET.WORD_CLOUD;
  }
  if (template.startsWith('chart-')) {
    return DATASET.CHART;
  }
  if (template.startsWith('relation-')) {
    if (template.includes('orth')) return DATASET.SYSTEM_DIAGNOSE;
    return DATASET.PROCESS;
  }
  if (template.startsWith('list-column-vertical-icon-arrow')) {
    return DATASET.TIMELINE;
  }
  if (template.startsWith('list-column-simple-vertical-arrow')) {
    return DATASET.TIMELINE;
  }
  return DATASET.LIST;
};
