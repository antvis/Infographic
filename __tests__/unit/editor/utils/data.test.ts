import { describe, expect, it } from 'vitest';
import { getChildrenDataByIndexes } from '../../../../src/editor/utils/data';
import type { Data } from '../../../../src/types';

describe('editor/utils/data', () => {
  it('returns root items when indexes empty', () => {
    const items = [{ label: 'a' }];
    const data: Data = { data: items, items } as any;
    expect(getChildrenDataByIndexes(data, [])).toBe(data.data);
  });

  it('navigates nested children and initializes children array', () => {
    const items = [{ label: 'a' }, { label: 'b', children: [{ label: 'c' }] }];
    const data: Data = { data: items, items } as any;

    const children = getChildrenDataByIndexes(data, [1]);
    expect(children).toEqual([{ label: 'c' }]);

    const nextLevel = getChildrenDataByIndexes(data, [1, 0]);
    expect(nextLevel).toEqual([]);
    expect(data.items[1].children).toEqual([{ label: 'c', children: [] }]);
  });
});
