import { describe, expect, it } from 'vitest';
import type { InfographicOptions } from '../../../src/options/types';
import { mergeOptions } from '../../../src/runtime/utils';

describe('runtime/utils', () => {
  describe('mergeOptions', () => {
    it('prefers source overrides while keeping unrelated base fields', () => {
      const base: Partial<InfographicOptions> = {
        width: 400,
        height: 200,
        padding: 12,
      };
      const overrides: Partial<InfographicOptions> = {
        width: 800,
        theme: 'dark',
      };

      const merged = mergeOptions(base, overrides);

      expect(merged.width).toBe(800);
      expect(merged.height).toBe(200);
      expect(merged.padding).toBe(12);
      expect(merged.theme).toBe('dark');
    });

    it('combines nested design, themeConfig, and svg objects', () => {
      const base: Partial<InfographicOptions> = {
        design: {
          structure: { type: 'base-structure' },
          title: 'base-title',
        },
        themeConfig: {
          palette: 'light',
        },
        svg: {
          attributes: {
            viewBox: '0 0 200 200',
          },
        },
      };
      const overrides: Partial<InfographicOptions> = {
        design: {
          title: 'override-title',
          items: ['override-item'],
        },
        themeConfig: {
          palette: 'dark',
        },
        svg: {
          style: {
            display: 'block',
          },
        },
      };

      const merged = mergeOptions(base, overrides);

      expect(merged.design?.structure).toEqual(base.design?.structure);
      expect(merged.design?.title).toBe('override-title');
      expect(merged.design?.items).toEqual(['override-item']);

      expect(merged.themeConfig?.palette).toBe('dark');

      expect(merged.svg?.attributes).toEqual(base.svg?.attributes);
      expect(merged.svg?.style).toEqual(overrides.svg?.style);
    });
  });
});
