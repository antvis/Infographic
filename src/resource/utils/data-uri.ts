import type { ResourceConfig } from '../types';

export function parseDataURI(resource: string): ResourceConfig | null {
  if (!resource.startsWith('data:')) return null;
  const commaIndex = resource.indexOf(',');
  if (commaIndex === -1) return null;

  const header = resource.slice(5, commaIndex);
  const data = resource.slice(commaIndex + 1);
  const parts = header.split(';');
  const mimeType = parts[0];
  const isBase64 = parts.includes('base64');

  if (mimeType === 'image/svg+xml' && !isBase64) {
    const decoded = data.startsWith('%3C') ? decodeURIComponent(data) : data;
    return {
      source: 'inline',
      format: 'svg',
      encoding: 'raw',
      data: decoded,
    };
  }

  if (mimeType.startsWith('image/')) {
    const format = mimeType === 'image/svg+xml' ? 'svg' : 'image';
    return {
      source: 'inline',
      format,
      encoding: isBase64 ? 'base64' : 'data-uri',
      data: resource,
    };
  }

  return null;
}
