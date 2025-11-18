import { describe, expect, it } from 'vitest';
import { hasColor } from '../../../src/utils/color';

describe('color', () => {
  describe('hasColor', () => {
    it('should return false for null, undefined, "none", "transparent", or empty string', () => {
      expect(hasColor(null)).toBe(false);
      expect(hasColor(undefined)).toBe(false);
      expect(hasColor('none')).toBe(false);
      expect(hasColor('transparent')).toBe(false);
      expect(hasColor('')).toBe(false);
      expect(hasColor('   ')).toBe(false);
    });

    it('should return true for any other string', () => {
      expect(hasColor('red')).toBe(true);
      expect(hasColor('#ff0000')).toBe(true);
      expect(hasColor('rgb(255, 0, 0)')).toBe(true);
    });
  });
});
