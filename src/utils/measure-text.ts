import type { FontData } from 'measury';
import { measureText as measure, registerFont } from 'measury';
import Tegakizatsu from 'measury/fonts/851tegakizatsu-Regular';
import AlibabaPuHuiTi from 'measury/fonts/AlibabaPuHuiTi-Regular';
import Arial from 'measury/fonts/Arial-Regular';
import LXGWWenKai from 'measury/fonts/LXGWWenKai-Regular';
import SourceHanSans from 'measury/fonts/SourceHanSans-Regular';
import SourceHanSerif from 'measury/fonts/SourceHanSerif-Regular';
import { TextProps } from '../jsx';
import { DEFAULT_FONT } from '../renderer';
import { decodeFontFamily, splitFontFamily } from './font';

const MEASURE_FONT_FAMILIES = new Set<string>();

function registerMeasureFont(font: FontData) {
  registerFont(font);
  MEASURE_FONT_FAMILIES.add(font.fontFamily);
}

[
  AlibabaPuHuiTi,
  SourceHanSans,
  SourceHanSerif,
  LXGWWenKai,
  Tegakizatsu,
  Arial,
].forEach(registerMeasureFont);

const GENERIC_MEASURE_FALLBACKS = new Map<string, string>([
  ['serif', 'Source Han Serif'],
  ['sans-serif', 'Source Han Sans'],
  ['monospace', 'Arial'],
  ['system-ui', 'Source Han Sans'],
  ['ui-sans-serif', 'Source Han Sans'],
  ['ui-serif', 'Source Han Serif'],
  ['ui-monospace', 'Arial'],
  ['ui-rounded', 'Source Han Sans'],
  ['cursive', '851tegakizatsu'],
  ['fantasy', '851tegakizatsu'],
  ['emoji', 'Arial'],
  ['math', 'Arial'],
  ['fangsong', 'Source Han Serif'],
]);

function resolveMeasureFontFamily(fontFamily: string) {
  const families = splitFontFamily(fontFamily);
  for (const family of families) {
    const normalized = decodeFontFamily(family);
    if (MEASURE_FONT_FAMILIES.has(normalized)) return normalized;
  }

  for (const family of families) {
    const normalized = decodeFontFamily(family).toLowerCase();
    const fallback = GENERIC_MEASURE_FALLBACKS.get(normalized);
    if (fallback && MEASURE_FONT_FAMILIES.has(fallback)) return fallback;
  }

  if (families.length) return decodeFontFamily(families[0]);
  return decodeFontFamily(fontFamily);
}

export function measureText(
  text: string | number | undefined = '',
  attrs: TextProps,
): { width: number; height: number } {
  if (attrs.width && attrs.height) {
    return { width: attrs.width, height: attrs.height };
  }

  let width = 0;
  let height = 0;

  const {
    fontFamily = DEFAULT_FONT,
    fontSize = 14,
    fontWeight = 'normal',
    lineHeight = 1.4,
  } = attrs;

  const metrics = measure(text.toString(), {
    fontFamily: resolveMeasureFontFamily(fontFamily),
    fontSize: +fontSize,
    fontWeight,
    lineHeight,
  });

  // 额外添加 1% 宽高
  width ||= Math.ceil(metrics.width * 1.01);
  height ||= Math.ceil(metrics.height * 1.01);

  return { width, height };
}
