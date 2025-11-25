import { describe, expect, it } from 'vitest';
import { isNode } from '../../../src/utils/is-node';

describe('isNode', () => {
  it('reflects Node.js runtime availability', () => {
    expect(typeof isNode).toBe('boolean');
    expect(isNode).toBe(Boolean(process?.versions?.node));
  });
});
