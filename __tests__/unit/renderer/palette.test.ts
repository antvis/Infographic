import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPaletteColor } from '../../../src/renderer/palettes/utils';

vi.mock('../../../src/renderer/palettes', () => ({
  getPalette: vi.fn(),
}));

describe('palette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaletteColor', () => {
    it('should return undefined for empty palette array', () => {
      const result = getPaletteColor([], [0, 1]);
      expect(result).toBeUndefined();
    });

    it('should return color from array palette using index', () => {
      const palette = ['#red', '#green', '#blue', '#yellow'];
      const result = getPaletteColor(palette, [0]);
      expect(result).toBe('#red');
    });

    it('should return color with modulo for out-of-bounds index', () => {
      const palette = ['#red', '#green', '#blue'];
      const result = getPaletteColor(palette, [5]); // 5 % 3 = 2
      expect(result).toBe('#blue');
    });

    it('should use 0 as fallback index when indexes array is empty', () => {
      const palette = ['#red', '#green', '#blue'];
      const result = getPaletteColor(palette, []);
      expect(result).toBe('#red'); // index defaults to 0
    });

    it('should work with function palette', () => {
      const paletteFunction = vi.fn(() => '#computed-color');
      const result = getPaletteColor(paletteFunction, [2], 10);

      expect(paletteFunction).toHaveBeenCalledWith(0.2, 2, 10); // ratio = 2/10
      expect(result).toBe('#computed-color');
    });

    it('should use ratio 0 when total is not provided for function palette', () => {
      const paletteFunction = vi.fn(() => '#computed-color');
      const result = getPaletteColor(paletteFunction, [2]);

      expect(paletteFunction).toHaveBeenCalledWith(0, 2, 0);
      expect(result).toBe('#computed-color');
    });
  });
});
