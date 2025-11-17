import type { Font } from './types';
import { decodeFontFamily, encodeFontFamily } from './utils';

const FONT_REGISTRY: Map<string, Font> = new Map();

export let DEFAULT_FONT = 'Alibaba PuHuiTi';

export function getFont(font: string) {
  const fontObj = FONT_REGISTRY.get(decodeFontFamily(font));
  if (!fontObj) return null;
  return fontObj;
}

export function getFonts() {
  return Array.from(FONT_REGISTRY.values());
}

export function setDefaultFont(font: string) {
  DEFAULT_FONT = encodeFontFamily(font);
}

/**
 * 注册自定义字体
 * @param font - 字体配置
 * @returns 注册后的字体配置
 * @example
 * ```js
 * registerFont({
 *  font: 'Alibaba PuHuiTi',
 *  name: '阿里巴巴普惠体',
 *  url: {
 *    regular: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css'
 *  }
 *})
 * ```
 * @description
 * 字体准备说明：https://chinese-font.netlify.app/zh-cn/post/simple_tutorial
 */
export function registerFont(font: Font): Font {
  const f = { ...font };
  FONT_REGISTRY.set(f.fontFamily, f);
  f.fontFamily = encodeFontFamily(f.fontFamily);
  return f;
}

export function unregisterFont(font: string) {
  const fontObj = getFont(font);
  if (!fontObj) return null;
  FONT_REGISTRY.delete(font);
  return fontObj;
}
