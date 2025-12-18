import type { Palette, StylizeConfig } from '../renderer';
import type {
  BaseAttributes,
  IconAttributes,
  ShapeAttributes,
  TextAttributes,
} from '../types';

export type DynamicAttributes<T extends object> = {
  [key in keyof T]?:
    | T[key]
    | ((value: T[key], node: SVGElement) => T[key] | undefined);
};

export interface ThemeConfig {
  /** 背景色 */
  colorBg?: string;
  /** 整体主色 */
  colorPrimary?: string;
  /** 全局基础样式 */
  base?: {
    /** 所有图形配置 */
    global?: DynamicAttributes<BaseAttributes>;
    /** 全局图形配置 */
    shape?: ShapeAttributes;
    /** 全局文本配置 */
    text?: TextAttributes;
  };
  palette?: Palette;
  title?: TextAttributes;
  desc?: TextAttributes;
  shape?: ShapeAttributes;
  item?: {
    icon?: DynamicAttributes<IconAttributes>;
    label?: DynamicAttributes<TextAttributes>;
    desc?: DynamicAttributes<TextAttributes>;
    value?: DynamicAttributes<TextAttributes>;
    shape?: DynamicAttributes<ShapeAttributes>;
  };
  /** 风格化 */
  stylize?: StylizeConfig | null;
  elements?: Record<string, ShapeAttributes | TextAttributes>;
}

export interface ThemeSeed {
  colorPrimary: string;
  colorBg?: string;
  isDarkMode?: boolean;
}

export interface ThemeColors {
  /** 原始主色 */
  colorPrimary: string;
  /** 主色浅色背景 */
  colorPrimaryBg: string;
  /** 主色背景上的文本颜色 */
  colorPrimaryText: string;
  /** 最深文本颜色 */
  colorText: string;
  /** 次要文本颜色 */
  colorTextSecondary: string;
  /** 纯白色 */
  colorWhite: string;
  /** 画布背景色 */
  colorBg: string;
  /** 卡片背景色 */
  colorBgElevated: string;
  /** 是否为暗色模式 */
  isDarkMode: boolean;
}
