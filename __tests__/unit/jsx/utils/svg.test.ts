import { describe, expect, it } from 'vitest';
import { toSVGAttr } from '../../../../src/jsx//utils';

describe('svg utils', () => {
  describe('toSVGAttr', () => {
    it('should return correct mapped attributes from SPECIFIC_ATTRS_MAP', () => {
      expect(toSVGAttr('className')).toBe('class');
      expect(toSVGAttr('viewBox')).toBe('viewBox');
      expect(toSVGAttr('preserveAspectRatio')).toBe('preserveAspectRatio');
      expect(toSVGAttr('gradientUnits')).toBe('gradientUnits');
      expect(toSVGAttr('xlinkHref')).toBe('href');
      expect(toSVGAttr('xmlLang')).toBe('xml:lang');
      expect(toSVGAttr('xmlSpace')).toBe('xml:space');
      expect(toSVGAttr('xmlnsXlink')).toBe('xmlns:xlink');
    });

    it('should convert camelCase to kebab-case for unmapped attributes', () => {
      expect(toSVGAttr('strokeWidth')).toBe('stroke-width');
      expect(toSVGAttr('fillOpacity')).toBe('fill-opacity');
      expect(toSVGAttr('fontSize')).toBe('font-size');
      expect(toSVGAttr('fontFamily')).toBe('font-family');
      expect(toSVGAttr('strokeDasharray')).toBe('stroke-dasharray');
    });

    it('should return unchanged for attributes that are already lowercase', () => {
      expect(toSVGAttr('fill')).toBe('fill');
      expect(toSVGAttr('stroke')).toBe('stroke');
      expect(toSVGAttr('x')).toBe('x');
      expect(toSVGAttr('y')).toBe('y');
      expect(toSVGAttr('width')).toBe('width');
      expect(toSVGAttr('height')).toBe('height');
    });

    it('should handle multiple capital letters correctly', () => {
      expect(toSVGAttr('strokeMiterlimit')).toBe('stroke-miterlimit');
      expect(toSVGAttr('clipPathUnits')).toBe('clipPathUnits'); // This one is in the map
      expect(toSVGAttr('someVeryLongCamelCaseName')).toBe(
        'some-very-long-camel-case-name',
      );
    });

    it('should handle single character attributes', () => {
      expect(toSVGAttr('r')).toBe('r');
      expect(toSVGAttr('d')).toBe('d');
    });

    it('should handle attributes with numbers', () => {
      expect(toSVGAttr('x1')).toBe('x1');
      expect(toSVGAttr('y2')).toBe('y2');
    });
  });
});
