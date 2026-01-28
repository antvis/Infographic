import { describe, expect, it } from 'vitest';
import { calculateZoomedViewBox, getViewBox } from '../../../src/utils/viewbox';

describe('getViewBox', () => {
  it('parses existing viewBox attribute', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '10 20 300 400');

    expect(getViewBox(svg)).toEqual({ x: 10, y: 20, width: 300, height: 400 });
  });

  it('falls back to width and height when viewBox is missing', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '250');

    expect(getViewBox(svg)).toEqual({ x: 0, y: 0, width: 500, height: 250 });
  });

  it('handles missing dimensions by returning zeros', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    expect(getViewBox(svg)).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });
});

describe('calculateZoomedViewBox', () => {
  it('correctly calculates zoomed viewBox when zooming in (factor < 1)', () => {
    const current = { x: 0, y: 0, width: 100, height: 100 };
    const pivot = { x: 50, y: 50 };
    const factor = 0.5;

    // Expected: Width/Height become 50. Center remains at 50,50.
    // New X = 50 - (50 - 0) * 0.5 = 25
    // New Y = 50 - (50 - 0) * 0.5 = 25
    const expected = { x: 25, y: 25, width: 50, height: 50 };

    expect(calculateZoomedViewBox(current, factor, pivot)).toEqual(expected);
  });

  it('correctly calculates zoomed viewBox when zooming out (factor > 1)', () => {
    const current = { x: 0, y: 0, width: 100, height: 100 };
    const pivot = { x: 0, y: 0 };
    const factor = 2.0;

    // Expected: Width/Height become 200. Pivot at 0,0 means simple scale.
    // New X = 0 - (0 - 0) * 2 = 0
    // New Y = 0 - (0 - 0) * 2 = 0
    const expected = { x: 0, y: 0, width: 200, height: 200 };

    expect(calculateZoomedViewBox(current, factor, pivot)).toEqual(expected);
  });

  it('returns identical viewBox when factor is 1', () => {
    const current = { x: 10, y: 20, width: 300, height: 400 };
    const pivot = { x: 50, y: 50 };
    const factor = 1.0;

    expect(calculateZoomedViewBox(current, factor, pivot)).toEqual(current);
  });

  it('handles pivot point outside of current viewBox', () => {
    const current = { x: 0, y: 0, width: 100, height: 100 };
    const pivot = { x: 200, y: 200 };
    const factor = 0.5;

    // Pivot is far bottom-right. Zooming in (0.5) should pull viewBox towards pivot.
    // New Width/Height: 50
    // New X = 200 - (200 - 0) * 0.5 = 200 - 100 = 100
    // New Y = 200 - (200 - 0) * 0.5 = 200 - 100 = 100
    const expected = { x: 100, y: 100, width: 50, height: 50 };

    expect(calculateZoomedViewBox(current, factor, pivot)).toEqual(expected);
  });
});
