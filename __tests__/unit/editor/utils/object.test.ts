import { describe, expect, it, vi } from 'vitest';
import { applyOptionUpdates } from '../../../../src/editor/utils/object';

describe('applyOptionUpdates', () => {
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

  it('handles array values as primitives (overwrites)', () => {
    const target = { a: [1, 2] };
    const source = { a: [3, 4] };
    applyOptionUpdates(target, source);
    expect(target.a).toEqual([3, 4]);
  });

  it('handles null values', () => {
    const target: any = { a: 1 };
    const source = { a: null };
    applyOptionUpdates(target, source);
    expect(target.a).toBeNull();
  });

  // ========== Collector Tests ==========

  it('calls collector with correct path and values on simple update', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3 };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { collector });
    expect(collector).toHaveBeenCalledWith('b', 3, 2);
    expect(collector).toHaveBeenCalledTimes(1);
  });

  it('calls collector with undefined on delete', () => {
    const target = { a: 1, b: 2 };
    const source = { b: undefined };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { collector });
    expect(collector).toHaveBeenCalledWith('b', undefined, 2);
  });

  it('does not call collector when value is unchanged', () => {
    const target = { a: 1 };
    const source = { a: 1 };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { collector });
    expect(collector).not.toHaveBeenCalled();
  });

  it('calls collector with nested path', () => {
    const target = { a: { x: 1 } };
    const source = { a: { x: 2 } };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { collector });
    expect(collector).toHaveBeenCalledWith('a.x', 2, 1);
  });

  it('calls collector with basePath prefix', () => {
    const target = { x: 1 };
    const source = { x: 2 };
    const collector = vi.fn();
    applyOptionUpdates(target, source, 'prefix', { collector });
    expect(collector).toHaveBeenCalledWith('prefix.x', 2, 1);
  });

  it('calls collector for each changed property in nested objects', () => {
    const target = { a: { x: 1, y: 2 } };
    const source = { a: { x: 10, y: undefined } };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { collector });
    expect(collector).toHaveBeenCalledWith('a.x', 10, 1);
    expect(collector).toHaveBeenCalledWith('a.y', undefined, 2);
    expect(collector).toHaveBeenCalledTimes(2);
  });

  // ========== BubbleUp Tests ==========

  it('bubbleUp triggers parent path notifications', () => {
    const target = { design: { background: 'white', font: 'Arial' } };
    const source = { design: { background: 'red', font: 'Helvetica' } };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { bubbleUp: true, collector });
    // 叶子节点通知
    expect(collector).toHaveBeenCalledWith('design.background', 'red', 'white');
    expect(collector).toHaveBeenCalledWith('design.font', 'Helvetica', 'Arial');
    // 父路径通知（冒泡）
    expect(collector).toHaveBeenCalledWith(
      'design',
      expect.objectContaining({ background: 'red', font: 'Helvetica' }),
      undefined,
    );
  });

  it('bubbleUp does not trigger when no changes detected', () => {
    const target = { a: 1 };
    const source = { a: 1 };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { bubbleUp: true, collector });
    expect(collector).not.toHaveBeenCalled();
  });

  it('bubbleUp triggers parent notifications in correct order (deepest first)', () => {
    const target = { a: { b: { c: 1 } } };
    const source = { a: { b: { c: 2 } } };
    const calls: string[] = [];
    const collector = (path: string) => calls.push(path);
    applyOptionUpdates(target, source, '', { bubbleUp: true, collector });
    // 叶子节点先触发，然后是父路径（按深度降序）
    expect(calls).toEqual(['a.b.c', 'a.b', 'a', '']);
  });

  it('prevents prototype pollution', () => {
    const target = {};
    const source = JSON.parse('{"__proto__": {"polluted": true}}');
    applyOptionUpdates(target, source);
    expect(({} as any).polluted).toBeUndefined();
    expect(target).toEqual({});
  });

  it('detects change when primitive is replaced by empty object', () => {
    const target = { a: 1 };
    const source = { a: {} };
    const collector = vi.fn();
    applyOptionUpdates(target, source, '', { bubbleUp: true, collector });

    expect(target.a).toEqual({});
    // Even if 'a' itself doesn't fire as a leaf, the root MUST change because 'a' changed.
    expect(collector).toHaveBeenCalledWith(
      '',
      expect.objectContaining({ a: {} }),
      undefined,
    );
  });

  it('collects cloned values during bubble up to prevent side effects', () => {
    const target = { a: { b: 1 } };
    const source = { a: { b: 2 } };
    let capturedValue: any;
    const collector = (_path: string, val: any) => {
      if (_path === 'a') {
        capturedValue = val;
      }
    };
    applyOptionUpdates(target, source, '', { bubbleUp: true, collector });

    expect(capturedValue).toEqual({ b: 2 });
    expect(capturedValue).not.toBe(target.a); // Should be a different reference

    // Verify modification to captured value doesn't affect target
    capturedValue.b = 3;
    expect(target.a.b).toBe(2);
  });
});
