import type { FontWeightName } from '../types';

const GENERIC_FONT_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  '-apple-system',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);

export function splitFontFamily(font: string): string[] {
  const families: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  const push = () => {
    const value = current.trim();
    if (value) families.push(value);
    current = '';
  };

  for (let i = 0; i < font.length; i += 1) {
    const char = font[i];
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === ',') {
      push();
      continue;
    }

    current += char;
  }

  push();
  return families;
}

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function isWrappedInQuotes(value: string) {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  );
}

function needsQuoting(value: string) {
  return /^\d/.test(value) || /\s/.test(value);
}

function encodeSingleFontFamily(font: string) {
  const trimmed = font.trim();
  if (!trimmed) return trimmed;
  if (isWrappedInQuotes(trimmed)) return trimmed;
  if (GENERIC_FONT_FAMILIES.has(trimmed.toLowerCase())) return trimmed;
  if (!needsQuoting(trimmed)) return trimmed;

  const quote = trimmed.includes('"') && !trimmed.includes("'") ? "'" : '"';
  return `${quote}${trimmed}${quote}`;
}

export function decodeFontFamily(font: string) {
  const families = splitFontFamily(font);
  if (!families.length) return '';
  if (families.length === 1) return stripWrappingQuotes(families[0]);
  return families.map((family) => stripWrappingQuotes(family)).join(', ');
}

export function encodeFontFamily(font: string) {
  const families = splitFontFamily(font);
  if (!families.length) return font.trim();
  return families.map((family) => encodeSingleFontFamily(family)).join(', ');
}

const FontWeightNameMap: Record<string, FontWeightName> = {
  '100': 'thin',
  hairline: 'thin',
  thin: 'thin',
  '200': 'extralight',
  ultralight: 'extralight',
  extralight: 'extralight',
  '300': 'light',
  light: 'light',
  '400': 'regular',
  normal: 'regular',
  regular: 'regular',
  '500': 'medium',
  medium: 'medium',
  '600': 'semibold',
  demibold: 'semibold',
  semibold: 'semibold',
  '700': 'bold',
  bold: 'bold',
  '800': 'extrabold',
  ultrabold: 'extrabold',
  extrabold: 'extrabold',
  '900': 'black',
  heavy: 'black',
  black: 'black',
  '950': 'extrablack',
  ultrablack: 'extrablack',
  extrablack: 'extrablack',
};

export function normalizeFontWeightName(
  fontWeight: string | number,
): FontWeightName {
  const key = String(fontWeight).toLowerCase();
  return FontWeightNameMap[key] || 'regular';
}
