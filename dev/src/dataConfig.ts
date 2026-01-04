import { Data } from '@antv/infographic';
import {
  COMPARE_DATA,
  HIERARCHY_DATA,
  HIERARCHY_STRUCTURE_DATA,
  LIST_DATA,
  SWOT_DATA,
  WORD_CLOUD_DATA,
} from './data';

export type DataKey = string;

export type DataEntry = {
  key: DataKey;
  label: string;
  value: Data;
};

export const DATA_OPTIONS: DataEntry[] = [
  { key: 'list', label: '列表数据', value: LIST_DATA },
  { key: 'hierarchy', label: '层级数据', value: HIERARCHY_DATA },
  {
    key: 'hierarchy-structure',
    label: '分层结构数据',
    value: HIERARCHY_STRUCTURE_DATA,
  },
  { key: 'compare', label: '对比数据', value: COMPARE_DATA },
  { key: 'swot', label: 'SWOT数据', value: SWOT_DATA },
  { key: 'wordcloud', label: '词云数据', value: WORD_CLOUD_DATA },
];

export const DATA_BY_KEY = DATA_OPTIONS.reduce(
  (acc, item) => {
    acc[item.key] = { label: item.label, value: item.value };
    return acc;
  },
  {} as Record<DataKey, { label: string; value: Data }>,
);

export const PREVIEW_DATA_KEYS: DataKey[] = [
  'list',
  'hierarchy',
  'hierarchy-structure',
  'compare',
  'swot',
  'wordcloud',
];

export type PreviewDataKey = (typeof PREVIEW_DATA_KEYS)[number];
