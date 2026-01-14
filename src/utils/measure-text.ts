import { measureText as measure, registerFont } from 'measury';
import AlibabaPuHuiTi from 'measury/fonts/AlibabaPuHuiTi-Regular';
import { JSXNode, TextProps } from '../jsx';
import { DEFAULT_FONT } from '../renderer';
import { encodeFontFamily } from './font';
import { isBrowser } from './is-browser';

let FONT_EXTEND_FACTOR = 1.01;

export const setFontExtendFactor = (factor: number) => {
  FONT_EXTEND_FACTOR = factor;
};

registerFont(AlibabaPuHuiTi);

let canvasContext: CanvasRenderingContext2D | null = null;
let measureSpan: HTMLSpanElement | null = null;

function getCanvasContext() {
  if (canvasContext) return canvasContext;
  const canvas = document.createElement('canvas');
  canvasContext = canvas.getContext('2d');
  return canvasContext;
}

function getMeasureSpan() {
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
  const options = {
    fontFamily,
    fontSize: parseFloat(fontSize.toString()),
    fontWeight,
    lineHeight,
  };
  const fallback = () => measure(content, options);
  const metrics = isBrowser()
    ? (measureTextInBrowser(content, options) ?? fallback())
    : fallback();

  // 额外添加 1% 宽高
  return {
    width: Math.ceil(metrics.width * FONT_EXTEND_FACTOR),
    height: Math.ceil(metrics.height * FONT_EXTEND_FACTOR),
  };
}
