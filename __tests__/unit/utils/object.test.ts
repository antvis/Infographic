import { describe, expect, it } from 'vitest';
import { applyOptionUpdates } from '../../../src/editor/utils/object';

describe('mergeOptions', () => {
  it('merges simple properties', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('deletes properties set to undefined', () => {
    const target = { a: 1, b: 2 };
    const source = { b: undefined };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: 1 });
    expect('b' in target).toBe(false);
  });

  it('merges nested objects', () => {
    const target = { a: { x: 1, y: 2 } };
    const source = { a: { y: 3, z: 4 } };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: { x: 1, y: 3, z: 4 } });
  });

  it('deletes nested properties set to undefined', () => {
    const target = { a: { x: 1, y: 2 } };
    const source = { a: { x: undefined } };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: { y: 2 } });
    expect('x' in target.a).toBe(false);
  });

  it('creates nested objects if they do not exist', () => {
    const target: any = { a: 1 };
    const source = { b: { x: 1 } };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: 1, b: { x: 1 } });
  });

  it('overwrites primitives with objects', () => {
    const target: any = { a: 1 };
    const source = { a: { x: 1 } };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: { x: 1 } });
  });

  it('overwrites objects with primitives', () => {
    const target: any = { a: { x: 1 } };
    const source = { a: 2 };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: 2 });
  });

  it('handles deep nested deletions', () => {
    const target = {
      level1: {
        level2: {
          level3: {
            prop1: 'keep',
            prop2: 'delete',
          },
        },
      },
    };
    const source = {
      level1: {
        level2: {
          level3: {
            prop2: undefined,
          },
        },
      },
    };
    applyOptionUpdates(target, source);
    expect(target.level1.level2.level3).toEqual({ prop1: 'keep' });
    expect('prop2' in target.level1.level2.level3).toBe(false);
  });

  it('ignores undefined in source if not present in target', () => {
    const target = { a: 1 };
    const source = { b: undefined };
    applyOptionUpdates(target, source);
    expect(target).toEqual({ a: 1 });
    expect('b' in target).toBe(false);
  });
});
