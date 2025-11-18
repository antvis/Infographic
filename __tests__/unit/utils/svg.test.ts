import { describe, expect, it, vi } from 'vitest';
import {
  createElement,
  getAttributes,
  getOrCreateDefs,
  getSizeBaseVal,
  parseSVG,
  removeAttributes,
  setAttributes,
  traverse,
} from '../../../src/utils/svg';

describe('svg', () => {
  describe('createElement', () => {
    it('should create SVG element with tagName', () => {
      const element = createElement('rect');
      expect(element.tagName).toBe('rect');
      expect(element.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });

    it('should create SVG element with attributes', () => {
      const element = createElement('rect', {
        width: '100',
        height: '50',
        fill: 'red',
      });
      expect(element.getAttribute('width')).toBe('100');
      expect(element.getAttribute('height')).toBe('50');
      expect(element.getAttribute('fill')).toBe('red');
    });

    it('should create element without attributes', () => {
      const element = createElement('circle');
      expect(element.tagName).toBe('circle');
    });
  });

  describe('parseSVG', () => {
    it('should parse valid SVG string', () => {
      const svgString =
        '<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="50"/></svg>';
      const result = parseSVG(svgString);

      expect(result?.tagName).toBe('svg');
      expect(result?.querySelector('rect')).toBeTruthy();
    });

    it('should throw error for invalid SVG string', () => {
      const invalidSvg = '<invalid><unclosed';
      expect(() => parseSVG(invalidSvg)).toThrow('Invalid SVG string');
    });

    it('should return null for empty or malformed input', () => {
      const malformedSvg = '<svg><parsererror>Error</parsererror></svg>';
      expect(() => parseSVG(malformedSvg)).toThrow('Invalid SVG string');
    });
  });

  describe('setAttributes', () => {
    it('should set attributes on element', () => {
      const element = createElement('rect');
      setAttributes(element, { width: '100', height: '50', fill: 'blue' });

      expect(element.getAttribute('width')).toBe('100');
      expect(element.getAttribute('height')).toBe('50');
      expect(element.getAttribute('fill')).toBe('blue');
    });

    it('should remove attributes when value is null', () => {
      const element = createElement('rect', { width: '100', height: '50' });
      setAttributes(element, { width: null, height: '75' });

      expect(element.getAttribute('width')).toBeNull();
      expect(element.getAttribute('height')).toBe('75');
    });
  });

  describe('getAttributes', () => {
    it('should get specified attributes', () => {
      const element = createElement('rect', {
        width: '100',
        height: '50',
        fill: 'red',
      });
      const attrs = getAttributes(element, ['width', 'height']);

      expect(attrs).toEqual({ width: '100', height: '50' });
    });

    it('should ignore empty attributes by default', () => {
      const element = createElement('rect', { width: '100', height: '' });
      const attrs = getAttributes(element, ['width', 'height']);

      expect(attrs).toEqual({ width: '100' });
    });

    it('should include empty attributes when ignoreEmpty is false', () => {
      const element = createElement('rect', { width: '100', height: '' });
      const attrs = getAttributes(element, ['width', 'height'], false);

      expect(attrs).toEqual({ width: '100', height: '' });
    });

    it('should include null attributes when ignoreEmpty is false', () => {
      const element = createElement('rect', { width: '100' });
      const attrs = getAttributes(element, ['width', 'height'], false);

      expect(attrs).toEqual({ width: '100', height: null });
    });
  });

  describe('removeAttributes', () => {
    it('should remove specified attributes', () => {
      const element = createElement('rect', {
        width: '100',
        height: '50',
        fill: 'red',
      });
      removeAttributes(element, ['width', 'fill']);

      expect(element.getAttribute('width')).toBeNull();
      expect(element.getAttribute('fill')).toBeNull();
      expect(element.getAttribute('height')).toBe('50');
    });
  });

  describe('traverse', () => {
    it('should traverse all elements in tree', () => {
      const svg = createElement('svg');
      const g1 = createElement('g');
      const g2 = createElement('g');
      const rect = createElement('rect');

      g2.appendChild(rect);
      g1.appendChild(g2);
      svg.appendChild(g1);

      const visited: string[] = [];
      traverse(svg, (element) => {
        visited.push(element.tagName);
      });

      expect(visited).toEqual(['svg', 'g', 'g', 'rect']);
    });

    it('should stop traversal when callback returns false', () => {
      const svg = createElement('svg');
      const g1 = createElement('g');
      const g2 = createElement('g');

      g1.appendChild(g2);
      svg.appendChild(g1);

      const visited: string[] = [];
      traverse(svg, (element) => {
        visited.push(element.tagName);
        if (element.tagName === 'g') return false;
      });

      expect(visited).toEqual(['svg', 'g']);
    });
  });

  describe('getOrCreateDefs', () => {
    it('should create new defs if not exists', () => {
      const svg = createElement<SVGSVGElement>('svg');
      const defs = getOrCreateDefs(svg);

      expect(defs.tagName).toBe('defs');
      expect(defs.id).toBe('infographic-defs');
      expect(svg.firstChild).toBe(defs);
    });

    it('should return existing defs if found', () => {
      const svg = createElement<SVGSVGElement>('svg');
      const existingDefs = createElement<SVGDefsElement>('defs');
      existingDefs.id = 'infographic-defs';
      svg.appendChild(existingDefs);

      const defs = getOrCreateDefs(svg);
      expect(defs).toBe(existingDefs);
    });

    it('should create defs with custom id', () => {
      const svg = createElement<SVGSVGElement>('svg');
      const defs = getOrCreateDefs(svg, 'custom-defs');

      expect(defs.id).toBe('custom-defs');
    });
  });

  describe('getSizeBaseVal', () => {
    it('should get size from width and height baseVal', () => {
      const svg = createElement<SVGSVGElement>('svg');
      Object.defineProperty(svg, 'width', {
        value: { baseVal: { value: 300 } },
      });
      Object.defineProperty(svg, 'height', {
        value: { baseVal: { value: 200 } },
      });

      const [width, height] = getSizeBaseVal(svg);
      expect(width).toBe(300);
      expect(height).toBe(200);
    });

    it('should fallback to viewBox when baseVal throws error', () => {
      const svg = createElement<SVGSVGElement>('svg');
      svg.setAttribute('viewBox', '0 0 400 300');

      Object.defineProperty(svg, 'width', {
        get() {
          throw new Error('baseVal error');
        },
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const [width, height] = getSizeBaseVal(svg);
      expect(width).toBe(400);
      expect(height).toBe(300);

      consoleSpy.mockRestore();
    });

    it('should handle viewBox with offset', () => {
      const svg = createElement<SVGSVGElement>('svg');
      svg.setAttribute('viewBox', '10 20 400 300');

      Object.defineProperty(svg, 'width', {
        get() {
          throw new Error('baseVal error');
        },
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const [width, height] = getSizeBaseVal(svg);
      expect(width).toBe(390);
      expect(height).toBe(280);

      consoleSpy.mockRestore();
    });

    it('should return [0, 0] when both baseVal and viewBox fail', () => {
      const svg = createElement<SVGSVGElement>('svg');

      Object.defineProperty(svg, 'width', {
        get() {
          throw new Error('baseVal error');
        },
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const [width, height] = getSizeBaseVal(svg);
      expect(width).toBe(0);
      expect(height).toBe(0);

      consoleSpy.mockRestore();
    });
  });
});
