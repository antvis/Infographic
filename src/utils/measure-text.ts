import { measureText as measure, registerFont } from 'measury';
import Tegakizatsu from 'measury/fonts/851tegakizatsu-Regular';
import AlibabaPuHuiTi from 'measury/fonts/AlibabaPuHuiTi-Regular';
import Arial from 'measury/fonts/Arial-Regular';
import LXGWWenKai from 'measury/fonts/LXGWWenKai-Regular';
import SourceHanSans from 'measury/fonts/SourceHanSans-Regular';
import SourceHanSerif from 'measury/fonts/SourceHanSerif-Regular';
import { JSXNode, TextProps } from '../jsx';
import { DEFAULT_FONT } from '../renderer';
import { decodeFontFamily, encodeFontFamily } from './font';

let FONT_EXTEND_FACTOR = 1.015;

export const setFontExtendFactor = (factor: number) => {
  FONT_EXTEND_FACTOR = factor;
};

registerFont(AlibabaPuHuiTi);

// Lazy-register extra measury fonts on first use (SSR only needs glyph data).
const EXTRA_MEASURY_FONTS: Record<string, Parameters<typeof registerFont>[0]> =
  {
    '851tegakizatsu': Tegakizatsu,
    Arial: Arial,
    'LXGW WenKai': LXGWWenKai,
    'Source Han Sans': SourceHanSans,
    'Source Han Serif': SourceHanSerif,
  };
const registeredMeasuryFonts = new Set<string>();

function ensureMeasuryFont(fontFamily: string) {
  // decodeFontFamily: '"851tegakizatsu", sans-serif' → '851tegakizatsu, sans-serif'
  // split by comma and take the first family name
  const primary = decodeFontFamily(fontFamily)?.split(',')[0]?.trim();
  if (!primary || registeredMeasuryFonts.has(primary)) return;
  const data = EXTRA_MEASURY_FONTS[primary];
  if (!data) return;
  registerFont(data);
  registeredMeasuryFonts.add(primary);
}

let canvasContext: CanvasRenderingContext2D | null | undefined = undefined;
let measureSpan: HTMLSpanElement | null = null;

function getCanvasContext() {
  if (typeof document === 'undefined') return null;
  if (canvasContext !== undefined) return canvasContext;
  const canvas = document.createElement('canvas');
  canvasContext = canvas.getContext('2d');
  return canvasContext;
}

function getMeasureSpan() {
  if (typeof document === 'undefined') return null;
  if (!document.body) return null;
  if (measureSpan) return measureSpan;
  measureSpan = document.createElement('span');
  measureSpan.style.position = 'absolute';
  measureSpan.style.top = '-10000px';
  measureSpan.style.left = '-10000px';
  measureSpan.style.visibility = 'hidden';
  measureSpan.style.pointerEvents = 'none';
  measureSpan.style.whiteSpace = 'pre';
  measureSpan.style.display = 'inline-block';
  measureSpan.style.padding = '0';
  measureSpan.style.margin = '0';
  document.body.appendChild(measureSpan);
  return measureSpan;
}

function resolveLineHeight(
  fontSize: number,
  lineHeight: number | string | undefined,
) {
  if (lineHeight === undefined || lineHeight === null) {
    return fontSize * 1.4;
  }
  if (typeof lineHeight === 'string') {
    const trimmed = lineHeight.trim();
    if (trimmed.endsWith('px')) {
      const value = Number.parseFloat(trimmed);
      return Number.isFinite(value) ? value : fontSize * 1.4;
    }
    lineHeight = Number(trimmed);
  }
  if (typeof lineHeight !== 'number' || !Number.isFinite(lineHeight)) {
    return fontSize * 1.4;
  }
  return lineHeight > 4 ? lineHeight : lineHeight * fontSize;
}

function measureTextInBrowser(
  content: string,
  {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  }: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    lineHeight: number | string | undefined;
  },
) {
  const lines = content.split(/\r?\n/);
  const normalizedFamily = encodeFontFamily(fontFamily);
  const normalizedWeight = fontWeight || 'normal';
  const lineHeightPx = resolveLineHeight(fontSize, lineHeight);

  const context = getCanvasContext();
  if (context) {
    context.font = `${normalizedWeight} ${fontSize}px ${normalizedFamily}`;
    const width = lines.reduce((maxWidth, line) => {
      const metrics = context.measureText(line);
      return Math.max(maxWidth, metrics.width);
    }, 0);
    return { width, height: lineHeightPx * Math.max(lines.length, 1) };
  }

  const span = getMeasureSpan();
  if (!span) return null;
  span.style.fontFamily = normalizedFamily;
  span.style.fontSize = `${fontSize}px`;
  span.style.fontWeight = String(normalizedWeight);
  span.style.lineHeight = `${lineHeightPx}px`;
  span.textContent = content;
  const rect = span.getBoundingClientRect();
  if (content && rect.width <= 0 && rect.height <= 0) return null;
  return { width: rect.width, height: rect.height };
}

export function measureText(
  text: JSXNode = '',
  attrs: TextProps,
): { width: number; height: number } {
  if (attrs.width && attrs.height) {
    return { width: attrs.width, height: attrs.height };
  }
  if (typeof text !== 'string' && typeof text !== 'number') {
    return { width: 0, height: 0 };
  }
  const {
    fontFamily = DEFAULT_FONT,
    fontSize = 14,
    fontWeight = 'normal',
    lineHeight = 1.4,
  } = attrs;

  const content = text.toString();
  ensureMeasuryFont(fontFamily);
  const options = {
    fontFamily,
    fontSize: parseFloat(fontSize.toString()),
    fontWeight,
    lineHeight,
  };
  const fallback = () =>
    measure(content, {
      ...options,
      fontFamily: decodeFontFamily(fontFamily),
    });
  const metrics = measureTextInBrowser(content, options) ?? fallback();

  // 额外添加 1% 宽高
  return {
    width: Math.ceil(metrics.width * FONT_EXTEND_FACTOR),
    height: Math.ceil(metrics.height * FONT_EXTEND_FACTOR),
  };
}

// 断行单元：CJK 逐字断行，其余按连续非空白片段（单词）断行
const CJK_RANGE =
  '\\u2e80-\\u9fff\\uac00-\\ud7ff\\uf900-\\ufaff\\ufe30-\\ufe4f\\uff00-\\uffef';
const BREAK_UNIT_REGEX = new RegExp(
  `\\s*(?:[${CJK_RANGE}]|[^\\s${CJK_RANGE}]+)`,
  'g',
);

// 单个断行单元仍超出容器宽度时，模拟 word-break: break-word 强制断开
function breakLongUnit(
  unit: string,
  maxWidth: number,
  widthOf: (value: string) => number,
) {
  let rest = unit;
  let extraLines = 0;

  while (rest.length > 1 && widthOf(rest) > maxWidth) {
    let fitted = 1;
    while (
      fitted < rest.length &&
      widthOf(rest.slice(0, fitted + 1)) <= maxWidth
    ) {
      fitted++;
    }
    if (fitted >= rest.length) break;
    extraLines++;
    rest = rest.slice(fitted);
  }

  return { extraLines, rest };
}

function countWrappedLines(
  line: string,
  maxWidth: number,
  widthOf: (value: string) => number,
) {
  const units = line.match(BREAK_UNIT_REGEX);
  if (!units) return 1;

  let lines = 1;
  let current = '';

  for (const unit of units) {
    const candidate = current ? current + unit : unit.trimStart();
    if (!candidate) continue;

    if (!current || widthOf(candidate) <= maxWidth) {
      current = candidate;
    } else {
      lines++;
      current = unit.trimStart();
    }

    const { extraLines, rest } = breakLongUnit(current, maxWidth, widthOf);
    lines += extraLines;
    current = rest;
  }

  return lines;
}

// 同一批 item 会互相测量彼此的文本，缓存行数避免 O(n²) 的重复折行计算。
// 仅在单次渲染内复用：Web 字体是渲染后才注入的，加载完成前后同一段文字的
// 度量结果不同，跨渲染复用会让行数停留在回退字体的测量值。
let lineCountCache: Map<string, number> | null = null;

/** 在一次渲染范围内复用折行测量结果，作用域外不缓存 */
export function withTextLinesCache<T>(render: () => T): T {
  const previous = lineCountCache;
  lineCountCache = new Map();
  try {
    return render();
  } finally {
    lineCountCache = previous;
  }
}

function getLineCountCacheKey(
  content: string,
  attrs: TextProps & { maxWidth: number },
) {
  const {
    maxWidth,
    fontFamily = DEFAULT_FONT,
    fontSize = 14,
    fontWeight = 'normal',
    lineHeight = 1.4,
  } = attrs;
  return [
    maxWidth,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    FONT_EXTEND_FACTOR,
    content,
  ].join('|');
}

/**
 * 测量文本在给定宽度内折行后的行数，与渲染层的换行行为对齐。
 */
export function measureTextLines(
  text: JSXNode = '',
  attrs: TextProps & { maxWidth: number },
): number {
  if (typeof text !== 'string' && typeof text !== 'number') return 0;
  const content = text.toString();
  if (!content) return 0;

  const { maxWidth } = attrs;
  const lines = content.split(/\r?\n/);
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) return lines.length;

  const compute = () => {
    // 测量单个片段的自然宽度，不能带入容器宽高（会短路 measureText）
    const textAttrs = { ...attrs, width: undefined, height: undefined };
    const widthOf = (value: string) => measureText(value, textAttrs).width;
    return lines.reduce(
      (count, line) => count + countWrappedLines(line, maxWidth, widthOf),
      0,
    );
  };

  if (!lineCountCache) return compute();

  const cacheKey = getLineCountCacheKey(content, attrs);
  let total = lineCountCache.get(cacheKey);
  if (total === undefined) lineCountCache.set(cacheKey, (total = compute()));

  return total;
}
