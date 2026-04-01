import type { ResourceConfig } from '../resource';

/**
 * Base datum structure for all infographic data elements.
 * This is the fundamental building block for items and relations.
 */
export interface BaseDatum {
  id?: string;
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  attributes?: Record<string, object>;
  [key: string]: any;
}

/**
 * Item datum represents a single data point in the infographic.
 * Used across all template types (list, hierarchy, sequence, etc).
 */
export interface ItemDatum extends BaseDatum {
  illus?: string | ResourceConfig;
  /** for hierarchical structure */
  children?: ItemDatum[];
  /** 图布局中用于分组，相同的 group 会使用同样的颜色 */
  group?: string;
}

/**
 * Relation datum represents a connection between two items.
 * Used in relation-based templates (network, flow, etc).
 */
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

/**
 * The core data contract for all AntV Infographic templates.
 * This is the single source of truth for infographic input data structure.
 * All templates, syntax parsers, and runtime consumers should use this interface.
 * 
 * @example
 * ```ts
 * const data: Data = {
 *   title: 'Q1 Sales Report',
 *   items: [
 *     { label: 'Product A', value: 100 },
 *     { label: 'Product B', value: 200 }
 *   ]
 * };
 * ```
 */
export interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  relations?: RelationDatum[];
  illus?: Record<string, string | ResourceConfig>;
  attributes?: Record<string, object>;
  [key: string]: any;
}
