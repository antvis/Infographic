import { fetchWithCache } from '../../utils';
import { loadImageBase64Resource } from './image';
import { loadSVGResource } from './svg';

function isRemoteResource(resource: string): boolean {
  try {
    return Boolean(new URL(resource));
  } catch {
    return false;
  }
}

function shouldParseAsSVG(contentType: string, format?: string) {
  const normalized = contentType.toLowerCase();
  if (normalized.includes('image/svg')) return true;
  if (!contentType && format === 'svg') return true;
  return false;
}

export async function loadRemoteResource(resource: string, format?: string) {
  if (!resource || !isRemoteResource(resource)) return null;

  const response = await fetchWithCache(resource);
  if (!response.ok) throw new Error('Failed to load resource');

  const contentType = response.headers.get('Content-Type') || '';

  if (shouldParseAsSVG(contentType, format)) {
    const svgText = await response.text();
    return loadSVGResource(svgText);
  }

  const blob = await response.blob();
  const base64 = await blobToBase64(blob);

  return loadImageBase64Resource(base64);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
