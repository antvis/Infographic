import type { Palette } from './types';

const PALETTE_REGISTRY = new Map<string, Palette>();

export function registerPalette(name: string, palette: Palette) {
  PALETTE_REGISTRY.set(name, palette);
}

export function getPalette(type: string): Palette | undefined {
  return PALETTE_REGISTRY.get(type);
}
