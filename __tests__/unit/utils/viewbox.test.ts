import { describe, expect, it } from 'vitest';
import { getViewBox } from '../../../src/utils/viewbox';

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
