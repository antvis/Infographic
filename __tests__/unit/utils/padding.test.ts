import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../src/utils/is-node', () => ({
  isNode: false,
}));

import { parsePadding, setSVGPadding } from '../../../src/utils/padding';

describe('padding', () => {
  describe('parsePadding', () => {
    it('should handle number input', () => {
      expect(parsePadding(10)).toEqual([10, 10, 10, 10]);
      expect(parsePadding(0)).toEqual([0, 0, 0, 0]);
      expect(parsePadding(5)).toEqual([5, 5, 5, 5]);
    });

    it('should handle single value array', () => {
      expect(parsePadding([10])).toEqual([10, 10, 10, 10]);
      expect(parsePadding([0])).toEqual([0, 0, 0, 0]);
    });

    it('should handle two values array (vertical, horizontal)', () => {
      expect(parsePadding([10, 20])).toEqual([10, 20, 10, 20]);
      expect(parsePadding([5, 15])).toEqual([5, 15, 5, 15]);
    });

    it('should handle three values array (top, horizontal, bottom)', () => {
      expect(parsePadding([10, 20, 30])).toEqual([10, 20, 30, 20]);
      expect(parsePadding([5, 15, 25])).toEqual([5, 15, 25, 15]);
    });

    it('should handle four values array (top, right, bottom, left)', () => {
      expect(parsePadding([10, 20, 30, 40])).toEqual([10, 20, 30, 40]);
      expect(parsePadding([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should return default padding for invalid arrays', () => {
      expect(parsePadding([] as any)).toEqual([0, 0, 0, 0]);
      expect(parsePadding([1, 2, 3, 4, 5] as any)).toEqual([0, 0, 0, 0]);
    });
  });

  describe('setSVGPadding', () => {
    it('should compute viewBox for svg connected inside a ShadowRoot', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);

      const shadowRoot = host.attachShadow({ mode: 'open' });
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      Object.defineProperty(svg, 'getBBox', {
        value: () =>
          ({
            x: 10,
            y: 20,
            width: 100,
            height: 50,
          }) as SVGRect,
      });
      Object.defineProperty(svg, 'getBoundingClientRect', {
        value: () =>
          ({
            width: 100,
            height: 50,
          }) as DOMRect,
      });

      shadowRoot.appendChild(svg);

      setSVGPadding(svg, [10, 20, 30, 40]);

      expect(svg.getAttribute('viewBox')).toBe('-30 10 160 90');
    });
  });
});
