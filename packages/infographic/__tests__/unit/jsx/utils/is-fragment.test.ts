import { Fragment } from '@antv/infographic-jsx';
import { describe, expect, it } from 'vitest';
import { isFragment } from '../../../src/utils/is-fragment';

describe('isFragment', () => {
  it('should return true for Fragment nodes', () => {
    const fragmentNode = { type: Fragment, props: { children: null } };
    expect(isFragment(fragmentNode)).toBe(true);
  });

  it('should return false for non-Fragment nodes', () => {
    const divNode = { type: 'div', props: { children: null } };
    const textNode = 'Hello';
    const nullNode = null;
    const undefinedNode = undefined;
    const booleanNode = true;
    const arrayNode = [divNode, textNode];

    expect(isFragment(divNode)).toBe(false);
    expect(isFragment(textNode)).toBe(false);
    expect(isFragment(nullNode)).toBe(false);
    expect(isFragment(undefinedNode)).toBe(false);
    expect(isFragment(booleanNode)).toBe(false);
    expect(isFragment(arrayNode)).toBe(false);
  });
});
