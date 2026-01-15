import type { DesignOptions, ParsedDesignsOptions } from '../designs';
import type { ElementProps, IInteraction, IPlugin } from '../editor';
import type { ThemeConfig } from '../themes';
import type { Data, Padding, ParsedData } from '../types';

export interface InfographicOptions {
  /** 容器，可以是选择器或者 HTMLElement */
  container?: string | HTMLElement;
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** 容器内边距 */
  padding?: Padding;
  /** 模板 */
  template?: string;
  /** 设计 */
  design?: DesignOptions;
  /** 数据 */
  data: Data;
  /** 主题 */
  theme?: string;
  /** 额外主题配置 */
  themeConfig?: ThemeConfig;
  /** svg 容器上的配置 */
  svg?: SVGOptions;

  /** 启用编辑 */
  editable?: boolean;
  /** 启用插件 */
  plugins?: IPlugin[];
  /** 启用交互 */
  interactions?: IInteraction[];
  /** 用于向画布添加图形 */
  elements?: ElementProps[];
}

export interface ParsedInfographicOptions {
  container: HTMLElement;
  width?: number | string;
  height?: number | string;
  padding?: Padding;
  viewBox?: string;
  template?: string;
  design: ParsedDesignsOptions;
  data: ParsedData;
  theme?: string;
  themeConfig: ThemeConfig;
  svg?: SVGOptions;

  editable?: boolean;
  plugins?: IPlugin[];
  interactions?: IInteraction[];
  shapes?: ElementProps[];
}

interface SVGOptions {
  style?: Record<string, string | number>;
  attributes?: Record<string, string | number | boolean>;
  id?: string;
  className?: string;
  /** 是否启用背景 */
  background?: boolean;
}
