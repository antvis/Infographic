import { describe, expect, it } from 'vitest';
import { ResizeElement } from '../../../../src/editor/plugins/resize-element';

describe('ResizeElement internal geometry helpers', () => {
  const plugin = new ResizeElement() as any;

  it('computes handle points and clamps minimum size', () => {
    const points = plugin.getHandlePoints({
      x: 0,
      y: 0,
      width: 10,
      height: 20,
    });
    expect(points[0]).toEqual([0, 0]);
    expect(points[4]).toEqual([10, 20]);

    const clamped = plugin.clampRect(
      { x: 0, y: 0, width: 0.2, height: 0.3 },
      'left',
    );
    expect(clamped.width).toBeGreaterThanOrEqual(1);
    expect(clamped.height).toBeGreaterThanOrEqual(1);
  });

  it('applies deltas according to handle position', () => {
    const base = { x: 10, y: 10, width: 20, height: 20 };
    expect(plugin.applyDelta(base, 5, 0, 'right')).toMatchObject({
      width: 25,
      x: 10,
    });
    expect(plugin.applyDelta(base, -5, -5, 'top-left')).toMatchObject({
      x: 5,
      y: 5,
      width: 25,
      height: 25,
    });
  });

  it('detects when rect has changed', () => {
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    expect(plugin.hasRectChanged(rect, { ...rect })).toBe(false);
    expect(plugin.hasRectChanged(rect, { ...rect, width: 11 })).toBe(true);
  });
});
