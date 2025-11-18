import { describe, expect, it } from 'vitest';
import type { Data } from '../../../src';
import { getDatumByIndexes } from '../../../src/utils/data';

describe('data', () => {
  describe('getDatumByIndexes', () => {
    const mockData: Data = {
      items: [
        {
          id: '1',
          label: 'item1',
          children: [
            {
              id: '1-1',
              label: 'item1-1',
              children: [
                { id: '1-1-1', label: 'item1-1-1' },
                { id: '1-1-2', label: 'item1-1-2' },
              ],
            },
            { id: '1-2', label: 'item1-2' },
          ],
        },
        {
          id: '2',
          label: 'item2',
          children: [{ id: '2-1', label: 'item2-1' }],
        },
      ],
    };

    it('should return empty object for empty indexes array', () => {
      const result = getDatumByIndexes(mockData, []);
      expect(result).toEqual({});
    });

    it('should return first level item for single index', () => {
      const result = getDatumByIndexes(mockData, [0]);
      expect(result).toEqual({
        id: '1',
        label: 'item1',
        children: [
          {
            id: '1-1',
            label: 'item1-1',
            children: [
              { id: '1-1-1', label: 'item1-1-1' },
              { id: '1-1-2', label: 'item1-1-2' },
            ],
          },
          { id: '1-2', label: 'item1-2' },
        ],
      });
    });

    it('should return second level item for two indexes', () => {
      const result = getDatumByIndexes(mockData, [0, 0]);
      expect(result).toEqual({
        id: '1-1',
        label: 'item1-1',
        children: [
          { id: '1-1-1', label: 'item1-1-1' },
          { id: '1-1-2', label: 'item1-1-2' },
        ],
      });
    });

    it('should return third level item for three indexes', () => {
      const result = getDatumByIndexes(mockData, [0, 0, 1]);
      expect(result).toEqual({
        id: '1-1-2',
        label: 'item1-1-2',
      });
    });

    it('should return correct item for different index combinations', () => {
      const result1 = getDatumByIndexes(mockData, [1]);
      expect(result1).toEqual({
        id: '2',
        label: 'item2',
        children: [{ id: '2-1', label: 'item2-1' }],
      });

      const result2 = getDatumByIndexes(mockData, [1, 0]);
      expect(result2).toEqual({
        id: '2-1',
        label: 'item2-1',
      });
    });

    // Edge cases and error handling
    it('should return undefined for out-of-bounds first level index', () => {
      const result = getDatumByIndexes(mockData, [5]);
      expect(result).toBeUndefined();
    });

    it('should return undefined for out-of-bounds nested index', () => {
      const result = getDatumByIndexes(mockData, [0, 5]);
      expect(result).toBeUndefined();
    });

    it('should return undefined for deeply nested out-of-bounds index', () => {
      const result = getDatumByIndexes(mockData, [0, 0, 5]);
      expect(result).toBeUndefined();
    });

    it('should handle negative indexes gracefully', () => {
      const result = getDatumByIndexes(mockData, [-1]);
      expect(result).toBeUndefined();
    });

    it('should handle accessing children of leaf nodes', () => {
      const result = getDatumByIndexes(mockData, [0, 0, 0, 0]);
      expect(result).toBeUndefined();
    });

    it('should work with array input instead of data object', () => {
      const result = getDatumByIndexes(mockData.items, [1, 0]);
      expect(result).toEqual({
        id: '2-1',
        label: 'item2-1',
      });
    });

    it('should handle empty data gracefully', () => {
      const emptyData: Data = { items: [] };
      const result = getDatumByIndexes(emptyData, [0]);
      expect(result).toBeUndefined();
    });

    it('should handle data with no children property', () => {
      const dataNoChildren: Data = {
        items: [
          { id: '1', label: 'item1' },
          { id: '2', label: 'item2' },
        ],
      };

      const result1 = getDatumByIndexes(dataNoChildren, [0]);
      expect(result1).toEqual({ id: '1', label: 'item1' });

      const result2 = getDatumByIndexes(dataNoChildren, [0, 0]);
      expect(result2).toBeUndefined();
    });

    it('should handle mixed data structures', () => {
      const mixedData: Data = {
        items: [
          {
            id: '1',
            label: 'item1',
            children: [
              { id: '1-1', label: 'item1-1' }, // no children
              {
                id: '1-2',
                label: 'item1-2',
                children: [{ id: '1-2-1', label: 'item1-2-1' }],
              },
            ],
          },
        ],
      };

      const result1 = getDatumByIndexes(mixedData, [0, 0]);
      expect(result1).toEqual({ id: '1-1', label: 'item1-1' });

      const result2 = getDatumByIndexes(mixedData, [0, 1, 0]);
      expect(result2).toEqual({ id: '1-2-1', label: 'item1-2-1' });

      const result3 = getDatumByIndexes(mixedData, [0, 0, 0]);
      expect(result3).toBeUndefined();
    });

    it('should handle very deep nesting', () => {
      const deepData: Data = {
        items: [
          {
            id: '1',
            label: 'level1',
            children: [
              {
                id: '1-1',
                label: 'level2',
                children: [
                  {
                    id: '1-1-1',
                    label: 'level3',
                    children: [
                      {
                        id: '1-1-1-1',
                        label: 'level4',
                        children: [{ id: '1-1-1-1-1', label: 'level5' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = getDatumByIndexes(deepData, [0, 0, 0, 0, 0]);
      expect(result).toEqual({ id: '1-1-1-1-1', label: 'level5' });
    });

    it('should handle floating point indexes as undefined (arrays only accept integers)', () => {
      const result = getDatumByIndexes(mockData, [0.9, 0.1]);
      expect(result).toBeUndefined();
    });

    it('should preserve all properties of returned items', () => {
      const dataWithExtraProps: Data = {
        items: [
          {
            id: '1',
            label: 'item1',
            value: 100,
            color: 'red',
            metadata: { type: 'test' },
            children: [
              {
                id: '1-1',
                label: 'item1-1',
                value: 50,
                description: 'child item',
              },
            ],
          },
        ],
      };

      const result = getDatumByIndexes(dataWithExtraProps, [0, 0]);
      expect(result).toEqual({
        id: '1-1',
        label: 'item1-1',
        value: 50,
        description: 'child item',
      });
    });
  });
});
