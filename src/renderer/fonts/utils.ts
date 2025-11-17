import type { FontWeightName } from './types';

export function decodeFontFamily(font: string) {
  return font.trim().replace(/["']/g, '');
}

export function encodeFontFamily(font: string) {
  if (font.startsWith('"')) return font;
  if (/^\d/.test(font)) return `"${font}"`;
  if (font.includes(' ')) return `"${font}"`;
  return font;
}

const FontWeightNameMap: Record<string, FontWeightName> = {
  '100': 'thin',
  hairline: 'thin',
  '200': 'extralight',
  ultralight: 'extralight',
  '300': 'light',
  '400': 'regular',
  normal: 'regular',
  '500': 'medium',
  '600': 'semibold',
  demibold: 'semibold',
  '700': 'bold',
  '800': 'extrabold',
  ultrabold: 'bold',
  '900': 'black',
  heavy: 'black',
  '950': 'extrablack',
  ultrablack: 'extrablack',
};

export function normalizeFontWeightName(
  fontWeight: string | number,
): FontWeightName {
  const key = String(fontWeight).toLowerCase();
  return FontWeightNameMap[key] || 'regular';
}
