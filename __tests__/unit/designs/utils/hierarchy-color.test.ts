import { describe, expect, it, vi } from 'vitest';
import {
  extractHierarchyNode,
  getHierarchyColorIndexes,
} from '../../../../src/designs/utils/hierarchy-color';

describe('getHierarchyColorIndexes', () => {
  it('computes indexes by level', () => {
    expect(
      getHierarchyColorIndexes(
        { depth: 2, originalIndexes: [0, 1, 2] },
        'level',
      ),
    ).toEqual([2]);
  });

  it('computes indexes by branch', () => {
    expect(
      getHierarchyColorIndexes({ depth: 0, originalIndexes: [0] }, 'branch'),
    ).toEqual([0]);
    expect(
      getHierarchyColorIndexes({ depth: 1, originalIndexes: [0, 2] }, 'branch'),
    ).toEqual([3]);
    expect(
      getHierarchyColorIndexes(
        { depth: 3, originalIndexes: [0, 1, 2, 3] },
        'branch',
      ),
    ).toEqual([2]);
  });

  it('uses full path or flat index for node modes', () => {
    const node = { depth: 2, originalIndexes: [0, 1, 2], flatIndex: 5 };
    expect(getHierarchyColorIndexes(node, 'node')).toEqual([0, 1, 2]);
    expect(getHierarchyColorIndexes(node, 'node-flat')).toEqual([5]);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fallbackNode = { depth: 1, originalIndexes: [0, 3] };
    expect(getHierarchyColorIndexes(fallbackNode, 'node-flat')).toEqual([0, 3]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('extractHierarchyNode', () => {
  it('extracts depth and original indexes from d3 node', () => {
    const d3Node = {
      depth: 1,
      data: { _originalIndex: [0, 2] },
    };
    expect(extractHierarchyNode(d3Node)).toEqual({
      depth: 1,
      originalIndexes: [0, 2],
    });
  });
});
