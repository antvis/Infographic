import { describe, expect, it } from 'vitest';
import { isNumber } from '../../../../src/jsx//utils';

describe('is-number utils', () => {
  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(42)).toBe(true);
      expect(isNumber(3.14159)).toBe(true);
      expect(isNumber(-3.14159)).toBe(true);
      expect(isNumber(0.1)).toBe(true);
    });

    it('should return true for very large and very small numbers', () => {
      expect(isNumber(Number.MAX_VALUE)).toBe(true);
      expect(isNumber(Number.MIN_VALUE)).toBe(true);
      expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
      expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
      expect(isNumber(1e10)).toBe(true);
      expect(isNumber(1e-10)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Number.NaN)).toBe(false);
      expect(isNumber(0 / 0)).toBe(false);
    });

    it('should return false for Infinity', () => {
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
      expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
      expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
      expect(isNumber(1 / 0)).toBe(false);
      expect(isNumber(-1 / 0)).toBe(false);
    });

    it('should return false for strings', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber('3.14')).toBe(false);
      expect(isNumber('0')).toBe(false);
      expect(isNumber('')).toBe(false);
      expect(isNumber('hello')).toBe(false);
      expect(isNumber('NaN')).toBe(false);
      expect(isNumber('Infinity')).toBe(false);
    });

    it('should return false for booleans', () => {
      expect(isNumber(true)).toBe(false);
      expect(isNumber(false)).toBe(false);
    });

    it('should return false for null and undefined', () => {
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });

    it('should return false for objects', () => {
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber({ value: 42 })).toBe(false);
      expect(isNumber([42])).toBe(false);
    });

    it('should return false for functions', () => {
      expect(isNumber(() => {})).toBe(false);
      expect(isNumber(function () {})).toBe(false);
      expect(isNumber(Math.abs)).toBe(false);
    });

    it('should return false for dates', () => {
      expect(isNumber(new Date())).toBe(false);
    });

    it('should return false for regular expressions', () => {
      expect(isNumber(/\d+/)).toBe(false);
    });

    it('should return false for symbols', () => {
      expect(isNumber(Symbol('test'))).toBe(false);
    });

    it('should return false for BigInt', () => {
      expect(isNumber(BigInt(42))).toBe(false);
      expect(isNumber(42n)).toBe(false);
    });

    it('should handle edge cases with Number constructor', () => {
      expect(isNumber(Number(42))).toBe(true);
      expect(isNumber(Number('42'))).toBe(true);
      expect(isNumber(Number('hello'))).toBe(false); // Number('hello') is NaN
      expect(isNumber(Number(true))).toBe(true); // Number(true) is 1
      expect(isNumber(Number(false))).toBe(true); // Number(false) is 0
      expect(isNumber(Number(null))).toBe(true); // Number(null) is 0
      expect(isNumber(Number(undefined))).toBe(false); // Number(undefined) is NaN
    });

    it('should handle mathematical operations that result in invalid numbers', () => {
      expect(isNumber(Math.sqrt(-1))).toBe(false); // NaN
      expect(isNumber(Math.log(-1))).toBe(false); // NaN
      expect(isNumber(0 * Infinity)).toBe(false); // NaN
      expect(isNumber(Infinity - Infinity)).toBe(false); // NaN
    });
  });
});
