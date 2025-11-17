import type { ThemeConfig } from './types';

const THEME_REGISTRY = new Map<string, ThemeConfig>();

export function registerTheme(name: string, theme: ThemeConfig) {
  THEME_REGISTRY.set(name, theme);
}

export function getTheme(name: string): ThemeConfig | undefined {
  return THEME_REGISTRY.get(name);
}

export function getThemes(): string[] {
  return Array.from(THEME_REGISTRY.keys());
}
