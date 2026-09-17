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

function resolveSpacing(
  spacing: number | string | undefined,
  fontSize: number,
): number {
  if (spacing === undefined || spacing === null) return 0;
  if (typeof spacing === 'number')
    return Number.isFinite(spacing) ? spacing : 0;

  const value = spacing.trim();
  if (!value) return 0;
  const match = value.match(/^([-+]?(?:\d+\.?\d*|\.\d+))(px|em)?$/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return 0;
  return match[2]?.toLowerCase() === 'em' ? amount * fontSize : amount;
}

function lineSpacing(
  line: string,
  letterSpacing: number,
  wordSpacing: number,
): number {
  const letterCount = Math.max(line.length - 1, 0);
  const wordCount = (line.match(/[ \t]/g) || []).length;
  return letterCount * letterSpacing + wordCount * wordSpacing;
}

function measureTextInBrowser(
  content: string,
  {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    wordSpacing,
  }: {
    fontFamily: string;
    fontSize: number;
    fontWeight: string | number;
    lineHeight: number | string | undefined;
    letterSpacing: number;
    wordSpacing: number;
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
      return Math.max(
        maxWidth,
        metrics.width + lineSpacing(line, letterSpacing, wordSpacing),
      );
    }, 0);
    return { width, height: lineHeightPx * Math.max(lines.length, 1) };
  }

  const span = getMeasureSpan();
  if (!span) return null;
  span.style.fontFamily = normalizedFamily;
  span.style.fontSize = `${fontSize}px`;
  span.style.fontWeight = String(normalizedWeight);
  span.style.lineHeight = `${lineHeightPx}px`;
  span.style.letterSpacing = `${letterSpacing}px`;
  span.style.wordSpacing = `${wordSpacing}px`;
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
    letterSpacing,
    wordSpacing,
  } = attrs;

  const content = text.toString();
  ensureMeasuryFont(fontFamily);
  const normalizedFontSize = parseFloat(fontSize.toString());
  const options = {
    fontFamily,
    fontSize: normalizedFontSize,
    fontWeight,
    lineHeight,
    letterSpacing: resolveSpacing(letterSpacing, normalizedFontSize),
    wordSpacing: resolveSpacing(wordSpacing, normalizedFontSize),
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
