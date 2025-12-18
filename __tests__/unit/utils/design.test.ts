import { describe, expect, it } from 'vitest';
import type { NullableParsedDesignsOptions } from '../../../src/designs';
import { isNonNullableParsedDesignsOptions } from '../../../src/utils/design';

const baseOptions: NullableParsedDesignsOptions = {
  structure: {} as NullableParsedDesignsOptions['structure'],
  title: { component: null },
  item: {} as NullableParsedDesignsOptions['item'],
  items: [{} as NullableParsedDesignsOptions['item']],
};

describe('design', () => {
  describe('isNonNullableParsedDesignsOptions', () => {
    it('returns true when structure, item, and items are all non-null', () => {
      expect(isNonNullableParsedDesignsOptions(baseOptions)).toBe(true);
    });

    it('returns false when structure is null', () => {
      const options: NullableParsedDesignsOptions = {
        ...baseOptions,
        structure: null,
      };

      expect(isNonNullableParsedDesignsOptions(options)).toBe(false);
    });

    it('returns false when item is null', () => {
      const options: NullableParsedDesignsOptions = {
        ...baseOptions,
        item: null,
      };

      expect(isNonNullableParsedDesignsOptions(options)).toBe(false);
    });

    it('returns false when any items entry is null', () => {
      const options: NullableParsedDesignsOptions = {
        ...baseOptions,
        items: [baseOptions.items[0], null],
      };

      expect(isNonNullableParsedDesignsOptions(options)).toBe(false);
    });

    it('returns true when items is empty', () => {
      const options: NullableParsedDesignsOptions = {
        ...baseOptions,
        items: [],
      };

      expect(isNonNullableParsedDesignsOptions(options)).toBe(true);
    });
  });
});
