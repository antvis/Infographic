import { describe, expect, it } from 'vitest';
import { DataURITypeEnum } from '../../../../src/renderer/constants';
import { parseDataURI } from '../../../../src/resource/utils/data-uri';

describe('data-uri', () => {
  describe('parseDataURI', () => {
    it('should return custom for non-data URI strings', () => {
      expect(parseDataURI('http://example.com/image.png')).toEqual({
        data: 'http://example.com/image.png',
        type: 'custom',
      });
      expect(parseDataURI('https://example.com/file.svg')).toEqual({
        data: 'https://example.com/file.svg',
        type: 'custom',
      });
      expect(parseDataURI('regular-string')).toEqual({
        data: 'regular-string',
        type: 'custom',
      });
    });

    it('should return null for malformed data URIs without comma', () => {
      expect(parseDataURI('data:image/png;base64')).toBeNull();
      expect(parseDataURI('data:text/plain')).toBeNull();
    });

    it('should parse base64 image data URIs', () => {
      const dataUri =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: DataURITypeEnum.Image,
        data: dataUri,
      });
    });

    it('should parse text/url data URIs as remote type', () => {
      const dataUri = 'data:text/url,https://example.com/image.png';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: DataURITypeEnum.Remote,
        data: 'https://example.com/image.png',
      });
    });

    it('should parse SVG data URIs', () => {
      const svgData = '<svg><circle r="10"/></svg>';
      const dataUri = `data:image/svg+xml,${svgData}`;
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: DataURITypeEnum.SVG,
        data: svgData,
      });
    });

    it('should handle unknown MIME types as custom', () => {
      const dataUri = 'data:application/json,{"key":"value"}';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: 'custom',
        data: dataUri,
      });
    });

    it('should handle data URIs with only MIME type', () => {
      const dataUri = 'data:text/plain,hello world';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: 'custom',
        data: dataUri,
      });
    });

    it('should handle data URIs with multiple semicolon-separated parameters', () => {
      const dataUri =
        'data:image/png;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: DataURITypeEnum.Image,
        data: dataUri,
      });
    });

    it('should handle empty data section', () => {
      const dataUri = 'data:text/plain,';
      const result = parseDataURI(dataUri);

      expect(result).toEqual({
        type: 'custom',
        data: dataUri,
      });
    });
  });
});
