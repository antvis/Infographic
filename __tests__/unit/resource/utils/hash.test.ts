import { describe, expect, it } from 'vitest';
import { getSimpleHash } from '../../../../src/resource/utils/hash';

describe('hash', () => {
  describe('getSimpleHash', () => {
    it('should return "0" for empty string', () => {
      expect(getSimpleHash('')).toBe('0');
    });

    it('should generate consistent hash for same input', () => {
      const input = 'test string';
      const hash1 = getSimpleHash(input);
      const hash2 = getSimpleHash(input);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = getSimpleHash('test1');
      const hash2 = getSimpleHash('test2');

      expect(hash1).not.toBe(hash2);
    });

    it('should generate numeric string output', () => {
      const hash = getSimpleHash('test');

      expect(typeof hash).toBe('string');
      expect(/^\d+$/.test(hash)).toBe(true);
    });

    it('should handle unicode characters', () => {
      const hash1 = getSimpleHash('测试');
      const hash2 = getSimpleHash('тест');
      const hash3 = getSimpleHash('🚀');

      expect(typeof hash1).toBe('string');
      expect(typeof hash2).toBe('string');
      expect(typeof hash3).toBe('string');
      expect(hash1).not.toBe(hash2);
      expect(hash2).not.toBe(hash3);
    });

    it('should handle long strings', () => {
      const longString = 'a'.repeat(1000);
      const hash = getSimpleHash(longString);

      expect(typeof hash).toBe('string');
      expect(/^\d+$/.test(hash)).toBe(true);
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*()[]{}|;:,.<>?';
      const hash = getSimpleHash(specialChars);

      expect(typeof hash).toBe('string');
      expect(/^\d+$/.test(hash)).toBe(true);
    });

    it('should always return positive numbers (absolute value)', () => {
      // Test multiple strings to ensure we always get positive numbers
      const testStrings = ['a', 'ab', 'abc', 'test', 'hello world'];

      for (const str of testStrings) {
        const hash = getSimpleHash(str);
        const hashNum = parseInt(hash, 10);
        expect(hashNum).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
