import type { ComponentType } from '../jsx';
import type { Item, ItemOptions } from './items';
import type { Structure, StructureOptions } from './structures';
import { TitleOptions } from './title';

export interface DesignOptions {
  /** 结构 */
  structure?: string | WithType<StructureOptions>;
  /** 标题 */
  title?: string | WithType<TitleOptions>;
  /** 数据项 */
  item?: string | WithType<ItemOptions>;
  /** 针对层级布局，不同层级使用不同 item */
  items?: (string | WithType<ItemOptions>)[];
}

export interface ParsedDesignsOptions {
  structure: WithProps<Structure>;
  title: {
    component: ComponentType<any> | null;
  };
  item: WithProps<Item>;
  items: WithProps<Item>[];
}

type WithType<T> = T & { type: string };
type WithProps<T> = T & { props?: any };
