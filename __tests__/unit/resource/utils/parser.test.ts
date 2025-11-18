import { describe, expect, it, vi } from 'vitest';
import { parseDataURI } from '../../../../src/resource/utils/data-uri';
import { parseResourceConfig } from '../../../../src/resource/utils/parser';

// Mock parseDataURI
vi.mock('../../../../src/resource/utils/data-uri', () => ({
  parseDataURI: vi.fn(),
}));

describe('parser', () => {
  describe('parseResourceConfig', () => {
    it('should return null for falsy config', () => {
      expect(parseResourceConfig('')).toBeNull();
      expect(parseResourceConfig(null as any)).toBeNull();
      expect(parseResourceConfig(undefined as any)).toBeNull();
    });

    it('should return ResourceConfig object as-is', () => {
      const config = {
        type: 'image' as const,
        data: 'some-data',
      };

      const result = parseResourceConfig(config);
      expect(result).toBe(config);
      expect(vi.mocked(parseDataURI)).not.toHaveBeenCalled();
    });

    it('should parse string config using parseDataURI', () => {
      const mockResult = {
        type: 'svg' as const,
        data: '<svg></svg>',
      };

      vi.mocked(parseDataURI).mockReturnValue(mockResult);

      const result = parseResourceConfig('data:image/svg+xml,<svg></svg>');

      expect(vi.mocked(parseDataURI)).toHaveBeenCalledWith(
        'data:image/svg+xml,<svg></svg>',
      );
      expect(result).toBe(mockResult);
    });

    it('should return null when parseDataURI returns null', () => {
      vi.mocked(parseDataURI).mockReturnValue(null);

      const result = parseResourceConfig('invalid-data-uri');

      expect(vi.mocked(parseDataURI)).toHaveBeenCalledWith('invalid-data-uri');
      expect(result).toBeNull();
    });
  });
});
