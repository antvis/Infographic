import type { ResourceConfig } from '../resource';

export interface BaseDatum {
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  illus?: string | ResourceConfig;
  attributes?: Record<string, object>;
  [key: string]: any;
}

/**
 * 列表型数据项
 */
export type ListDatum = BaseDatum;

/**
 * 序列型数据项
 */
export type SequenceDatum = BaseDatum;

/**
 * 层级型数据项
 */
export interface HierarchyDatum extends BaseDatum {
  children?: HierarchyDatum[];
}

/**
 * 对比型数据项
 */
export type CompareDatum = HierarchyDatum;

/**
 * 关系型数据节点
 */
export interface RelationNodeDatum extends BaseDatum {
  id?: string;
  group?: string;
}

/**
 * 关系型数据连线
 */
export interface RelationEdgeDatum extends BaseDatum {
  id?: string;
  from: string;
  to: string;
  /**
   * 表示连线的方向，默认 'forward'
   * - 'forward'：单向，从 from 指向 to
   * - 'both'：双向
   * - 'none'：无方向
   */
  direction?: 'forward' | 'both' | 'none';
  showArrow?: boolean;
  arrowType?: 'arrow' | 'triangle' | 'diamond';
}

/**
 * 统计型数据项
 */
export interface StatisticsDatum extends BaseDatum {
  value: number;
  category?: string;
}

export type ItemDatum =
  | ListDatum
  | SequenceDatum
  | HierarchyDatum
  | CompareDatum
  | RelationNodeDatum
  | StatisticsDatum;

export interface BaseData {
  title?: string;
  desc?: string;
  items?: ItemDatum[];
  illus?: Record<string, string | ResourceConfig>;
  attributes?: Record<string, object>;
  [key: string]: any;
}

/**
 * 列表型数据
 */
export interface ListData extends BaseData {
  items?: ListDatum[];
  lists?: ListDatum[];
}

/**
 * 序列型数据
 */
export interface SequenceData extends BaseData {
  items?: SequenceDatum[];
  sequences?: SequenceDatum[];
  order?: 'asc' | 'desc';
}

/**
 * 层级型数据
 */
export interface HierarchyData extends BaseData {
  items?: [HierarchyDatum];
  root?: HierarchyDatum;
}

/**
 * 对比型数据
 */
export interface CompareData extends BaseData {
  items?: CompareDatum[];
  compares?: CompareDatum[];
}

/**
 * 关系型数据
 */
export interface RelationData extends BaseData {
  items?: RelationNodeDatum[];
  nodes?: RelationNodeDatum[];
  relations?: RelationEdgeDatum[];
}

/**
 * 统计型数据
 */
export interface StatisticsData extends BaseData {
  items?: StatisticsDatum[];
  values?: StatisticsDatum[];
}

export type Data =
  | ListData
  | SequenceData
  | HierarchyData
  | CompareData
  | RelationData
  | StatisticsData;

export type ParsedData = Data & {
  items: ItemDatum[];
};
