import { describe, expect, it } from 'vitest';
import { parsePadding } from '../../../src/utils/padding';

describe('padding', () => {
  describe('parsePadding', () => {
    it('should handle number input', () => {
      expect(parsePadding(10)).toEqual([10, 10, 10, 10]);
      expect(parsePadding(0)).toEqual([0, 0, 0, 0]);
      expect(parsePadding(5)).toEqual([5, 5, 5, 5]);
    });

    it('should handle single value array', () => {
      expect(parsePadding([10])).toEqual([10, 10, 10, 10]);
      expect(parsePadding([0])).toEqual([0, 0, 0, 0]);
    });

    it('should handle two values array (vertical, horizontal)', () => {
      expect(parsePadding([10, 20])).toEqual([10, 20, 10, 20]);
      expect(parsePadding([5, 15])).toEqual([5, 15, 5, 15]);
    });

    it('should handle three values array (top, horizontal, bottom)', () => {
      expect(parsePadding([10, 20, 30])).toEqual([10, 20, 30, 20]);
      expect(parsePadding([5, 15, 25])).toEqual([5, 15, 25, 15]);
    });

    it('should handle four values array (top, right, bottom, left)', () => {
      expect(parsePadding([10, 20, 30, 40])).toEqual([10, 20, 30, 40]);
      expect(parsePadding([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should return default padding for invalid arrays', () => {
      expect(parsePadding([] as any)).toEqual([0, 0, 0, 0]);
      expect(parsePadding([1, 2, 3, 4, 5] as any)).toEqual([0, 0, 0, 0]);
    });
  });
});
