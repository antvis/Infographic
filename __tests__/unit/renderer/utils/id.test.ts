import { describe, expect, it } from 'vitest';
import { getSafetyId } from '../../../../src/renderer/utils/id';

describe('id', () => {
  describe('getSafetyId', () => {
    it('should remove special characters and replace commas with dashes', () => {
      expect(getSafetyId('test#id')).toBe('testid');
      expect(getSafetyId('test%id')).toBe('testid');
      expect(getSafetyId('test.id')).toBe('testid');
      expect(getSafetyId('test id')).toBe('testid');
      expect(getSafetyId('test/id')).toBe('testid');
      expect(getSafetyId('test(id)')).toBe('testid');
      expect(getSafetyId('test,id')).toBe('test-id');
    });

    it('should handle multiple special characters', () => {
      expect(getSafetyId('test#%./()id')).toBe('testid');
      expect(getSafetyId('test,id,name')).toBe('test-id-name');
      expect(getSafetyId('test#id,name%value')).toBe('testid-namevalue');
    });

    it('should handle empty string', () => {
      expect(getSafetyId('')).toBe('');
    });

    it('should handle string with only special characters', () => {
      expect(getSafetyId('#%./() ')).toBe('');
      expect(getSafetyId(',,,')).toBe('---');
    });

    it('should preserve valid characters', () => {
      expect(getSafetyId('validId123')).toBe('validId123');
      expect(getSafetyId('test-id_name')).toBe('test-id_name');
    });
  });
});
