import { describe, expect, it } from 'vitest';
import { parseDataURI } from '../../../../src/resource/utils/data-uri';

describe('data-uri', () => {
  describe('parseDataURI', () => {
    it('should return null for malformed data URIs without comma', () => {
      expect(parseDataURI('data:image/png;base64')).toBeNull();
      expect(parseDataURI('data:text/plain')).toBeNull();
    });

    it('should parse base64 image data URIs', () => {
      const dataUri =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        source: 'inline',
        format: 'image',
        encoding: 'base64',
        data: dataUri,
      });
    });

    it('should parse SVG data URIs', () => {
      const svgData = '<svg><circle r="10"/></svg>';
      const dataUri = `data:image/svg+xml,${svgData}`;
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        source: 'inline',
        format: 'svg',
        encoding: 'raw',
        data: svgData,
      });
    });

    it('should handle unknown MIME types as custom', () => {
      const dataUri = 'data:application/json,{"key":"value"}';
      const result = parseDataURI(dataUri);

      expect(result).toBeNull();
    });

    it('should handle data URIs with only MIME type', () => {
      const dataUri = 'data:text/plain,hello world';
      const result = parseDataURI(dataUri);

      expect(result).toBeNull();
    });

    it('should handle data URIs with multiple semicolon-separated parameters', () => {
      const dataUri =
        'data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        source: 'inline',
        format: 'image',
        encoding: 'base64',
        data: dataUri,
      });
    });

    it('should handle empty data section', () => {
      const dataUri = 'data:text/plain,';
      const result = parseDataURI(dataUri);

      expect(result).toBeNull();
    });
  });
});
