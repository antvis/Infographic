import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseDataURI } from '../../../../src/resource/utils/data-uri';
import { getSimpleHash } from '../../../../src/resource/utils/hash';
import {
  getResourceHref,
  getResourceId,
} from '../../../../src/resource/utils/ref';

// Mock dependencies
vi.mock('../../../../src/resource/utils/data-uri', () => ({
  parseDataURI: vi.fn(),
}));

vi.mock('../../../../src/resource/utils/hash', () => ({
  getSimpleHash: vi.fn(),
}));

describe('ref', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getResourceId', () => {
    it('should return null for invalid string config', () => {
      vi.mocked(parseDataURI).mockReturnValue(null);

      const result = getResourceId('invalid-config');

      expect(parseDataURI).toHaveBeenCalledWith('invalid-config');
      expect(result).toBeNull();
    });

    it('should generate hash for string config', () => {
      const mockConfig = {
        type: 'image' as const,
        data: 'image-data',
      };

      vi.mocked(parseDataURI).mockReturnValue(mockConfig);
      vi.mocked(getSimpleHash).mockReturnValue('12345');

      const result = getResourceId('data:image/png;base64,abc123');

      expect(parseDataURI).toHaveBeenCalledWith('data:image/png;base64,abc123');
      expect(getSimpleHash).toHaveBeenCalledWith(JSON.stringify(mockConfig));
      expect(result).toBe('12345');
    });

    it('should generate hash for ResourceConfig object', () => {
      const config = {
        type: 'svg' as const,
        data: '<svg></svg>',
      };

      vi.mocked(getSimpleHash).mockReturnValue('67890');

      const result = getResourceId(config);

      expect(parseDataURI).not.toHaveBeenCalled();
      expect(getSimpleHash).toHaveBeenCalledWith(JSON.stringify(config));
      expect(result).toBe('67890');
    });

    it('should return null for null ResourceConfig', () => {
      const result = getResourceId(null as any);
      expect(result).toBeNull();
    });
  });

  describe('getResourceHref', () => {
    it('should return null when getResourceId returns null', () => {
      vi.mocked(parseDataURI).mockReturnValue(null);

      const result = getResourceHref('invalid-config');

      expect(result).toBeNull();
    });

    it('should return href with hash when getResourceId succeeds', () => {
      const mockConfig = {
        type: 'image' as const,
        data: 'image-data',
      };

      vi.mocked(parseDataURI).mockReturnValue(mockConfig);
      vi.mocked(getSimpleHash).mockReturnValue('abc123');

      const result = getResourceHref('data:image/png;base64,def456');

      expect(result).toBe('#abc123');
    });

    it('should work with ResourceConfig object', () => {
      const config = {
        type: 'svg' as const,
        data: '<svg></svg>',
      };

      vi.mocked(getSimpleHash).mockReturnValue('xyz789');

      const result = getResourceHref(config);

      expect(result).toBe('#xyz789');
    });
  });
});
