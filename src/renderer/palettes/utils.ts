import { getPalette } from './registry';
import type { Palette } from './types';

export const getPaletteColor = (
  args: string | Palette = [],
  indexes: number[],
  total?: number,
) => {
  const palette = typeof args === 'string' ? getPalette(args) || [] : args;
  const index = indexes[0] ?? 0;

  if (typeof palette === 'function') {
    const ratio = total ? index / total : 0;
    return palette(ratio, index, total ?? 0);
  }

  if (Array.isArray(palette)) {
    if (palette.length === 0) return;
    return palette[index % palette.length] as string;
  }
};
