import { ICON_SERVICE_URL } from '../../constants';
import { fetchWithCache } from '../../utils';
import { loadImageBase64Resource } from './image';
import { loadRemoteResource } from './remote';
import { loadSVGResource } from './svg';

const queryIcon = async (query: string): Promise<string | null> => {
  try {
    const params = new URLSearchParams({ text: query, topK: '1' });
    const url = `${ICON_SERVICE_URL}?${params.toString()}`;
    const response = await fetchWithCache(url);
    if (!response.ok) return null;
    const result = await response.json();
    if (!result?.status || !Array.isArray(result.data?.data)) return null;
    return (result.data.data[0] as string) || null;
  } catch (error) {
    console.error(`Failed to query icon for "${query}":`, error);
    return null;
  }
};

function isDataURI(resource: string): boolean {
  return resource.startsWith('data:');
}

function looksLikeSVG(resource: string): boolean {
  const str = resource.trim();
  return str.startsWith('<svg') || str.startsWith('<symbol');
}

export async function loadSearchResource(query: string, format?: string) {
  if (!query) return null;
  const result = await queryIcon(query);
  if (!result) return null;

  if (looksLikeSVG(result)) return loadSVGResource(result);

  if (isDataURI(result)) {
    const mimeType = result.match(/^data:([^;]+)/)?.[1] || '';
    const isBase64 = result.includes(';base64,');
    if (mimeType === 'image/svg+xml' && !isBase64) {
      const commaIndex = result.indexOf(',');
      const svgText = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
      return loadSVGResource(svgText);
    }
    if (mimeType === 'image/svg+xml' && format === 'svg' && isBase64) {
      return loadImageBase64Resource(result);
    }
    return loadImageBase64Resource(result);
  }

  return loadRemoteResource(result, format);
}
