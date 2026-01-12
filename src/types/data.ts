import type { ResourceConfig } from '../resource';

export interface BaseDatum {
  id?: string;
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  attributes?: Record<string, object>;
  [key: string]: any;
}

export interface ItemDatum extends BaseDatum {
  illus?: string | ResourceConfig;
  /** for hierarchical structure */
  children?: ItemDatum[];
}

export interface RelationDatum extends BaseDatum {
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

export interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  relations?: RelationDatum[];
  illus?: Record<string, string | ResourceConfig>;
  attributes?: Record<string, object>;
  [key: string]: any;
}
