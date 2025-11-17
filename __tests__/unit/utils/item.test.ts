import { getIndexesFromItemKey, getItemIndexes } from '@/utils/item';
import { describe, expect, it } from 'vitest';

describe('item', () => {
  describe('getIndexesFromItemKey', () => {
    it('should convert item key to zero-based indexes array', () => {
      expect(getIndexesFromItemKey('0,1,2')).toEqual([0, 1, 2]);
      expect(getIndexesFromItemKey('0')).toEqual([0]);
      expect(getIndexesFromItemKey('4,9,1')).toEqual([4, 9, 1]);
    });

    it('should handle custom separator', () => {
      expect(getIndexesFromItemKey('0-1-2', '-')).toEqual([0, 1, 2]);
      expect(getIndexesFromItemKey('0|1|2', '|')).toEqual([0, 1, 2]);
    });
  });

  describe('getItemIndexes', () => {
    it('should extract zero-based indexes from item ID', () => {
      expect(getItemIndexes('0,1,2')).toEqual([0, 1, 2]);
      expect(getItemIndexes('0')).toEqual([0]);
      expect(getItemIndexes('4,9,1')).toEqual([4, 9, 1]);
    });
  });
});
