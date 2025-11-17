import { DataURITypeEnum } from '../../renderer/constants';
import type { ResourceConfig } from '../types';

export function parseDataURI(resource: string): ResourceConfig | null {
  if (!resource.startsWith('data:')) return { type: 'custom', data: resource };
  const commaIndex = resource.indexOf(',');
  if (commaIndex === -1) return null;

  const header = resource.slice(5, commaIndex);
  const data = resource.slice(commaIndex + 1);
  const parts = header.split(';');
  const mimeType = parts[0];

  if (parts.includes('base64')) {
    return { type: DataURITypeEnum.Image, data: resource };
  }

  const typeMap: Record<string, DataURITypeEnum> = {
    'text/url': DataURITypeEnum.Remote,
    'image/svg+xml': DataURITypeEnum.SVG,
  };

  const type = typeMap[mimeType];
  if (type) return { type, data };
  return { type: 'custom', data: resource };
}
