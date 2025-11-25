import { describe, expect, it } from 'vitest';
import {
  getColorPrimary,
  getPaletteColor,
  getPaletteColors,
  getThemeColors,
} from '../../../../src/designs/utils/color';

describe('design color utils', () => {
  it('returns configured or default primary color', () => {
    expect(
      getColorPrimary({ themeConfig: { colorPrimary: '#123456' } } as any),
    ).toBe('#123456');
    expect(getColorPrimary({ themeConfig: {} } as any)).toBe('#FF356A');
  });

  it('builds palette colors with fallback', () => {
    const options = {
      themeConfig: { colorPrimary: '#abcdef' },
      data: { items: [{}, {}, {}] },
    } as any;
    expect(getPaletteColors(options)).toEqual([
      '#abcdef',
      '#abcdef',
      '#abcdef',
    ]);

    const optionsWithPalette = {
      themeConfig: { palette: ['#1', '#2'] },
      data: { items: [{}, {}, {}] },
    } as any;
    expect(getPaletteColors(optionsWithPalette)).toEqual(['#1', '#2', '#1']);

    const optionsWithoutItems = {
      themeConfig: {},
      data: { items: [] },
    } as any;
    expect(getPaletteColors(optionsWithoutItems)).toEqual(['#FF356A']);
  });

  it('gets palette color by indexes', () => {
    const options = {
      themeConfig: { palette: ['#a', '#b'] },
      data: { items: [{}, {}] },
    } as any;
    expect(getPaletteColor(options, [1])).toBe('#b');
  });

  it('delegates theme generation with dark mode flag', () => {
    const result = getThemeColors(
      { colorPrimary: '#111111', colorBg: '#ffffff' },
      { themeConfig: { colorPrimary: '#333333', colorBg: '#444444' } } as any,
    );

    expect(result.colorPrimary).toBe('#111111');
    expect(result.colorBg).toBe('#ffffff');
    expect(result.isDarkMode).toBe(false);
  });
});
