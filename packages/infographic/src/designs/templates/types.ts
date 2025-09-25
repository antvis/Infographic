import type { ComponentType } from '@antv/infographic-jsx';
import type { Item, ItemOptions } from '../items';
import type { Structure, StructureOptions } from '../structures';

export interface TitleOptions {
  type: string;
  [key: string]: any;
}

export interface TemplateOptions {
  /** 结构 */
  structure?: string | WithType<StructureOptions>;
  /** 标题 */
  title?: string | WithType<TitleOptions>;
  /** 数据项 */
  item?: string | WithType<ItemOptions>;
}

export interface ParsedTemplateOptions {
  structure: WithProps<Structure>;
  title: {
    component: ComponentType<any> | null;
  };
  item: WithProps<Item>;
}

type WithType<T> = T & { type: string };
type WithProps<T> = T & { props?: any };
