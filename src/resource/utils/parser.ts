import type { ResourceConfig, ResourceFormat } from '../types';
import { parseDataURI } from './data-uri';

const KNOWN_FORMATS = new Set(['svg', 'png', 'jpg', 'jpeg', 'webp', 'gif']);

function looksLikeSVG(resource: string) {
  const str = resource.trim();
  return str.startsWith('<svg') || str.startsWith('<symbol');
}

function inferFormatFromUrl(url: string): ResourceFormat | undefined {
  const lower = url.toLowerCase();
  if (lower.endsWith('.svg') || lower.includes('.svg?')) return 'svg';
  if (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.gif')
  ) {
    return 'image';
  }
  return undefined;
}

function parseRefResource(resource: string): ResourceConfig | null {
  if (!resource.startsWith('ref:')) return null;
  const rest = resource.slice(4);
  const [source, ...restParts] = rest.split(':');
  if (!source || restParts.length === 0) return null;

  let format: string | undefined;
  if (restParts.length > 1 && KNOWN_FORMATS.has(restParts[0].toLowerCase())) {
    format = restParts.shift()?.toLowerCase();
  }

  const payload = restParts.join(':');
  if (!payload) return null;

  const normalizedSource = source === 'url' ? 'remote' : source;

  if (normalizedSource === 'remote') {
    return {
      source: 'remote',
      format: format || inferFormatFromUrl(payload) || undefined,
      data: payload,
    };
  }

  if (normalizedSource === 'search') {
    return {
      source: 'search',
      format: format || 'svg',
      data: payload,
    };
  }

  if (normalizedSource === 'svg') {
    return { source: 'inline', format: 'svg', data: payload, encoding: 'raw' };
  }

  return { source: 'custom', data: resource, format };
}

export function parseResourceConfig(
  config: string | ResourceConfig,
): ResourceConfig | null {
  if (!config) return null;
  if (typeof config !== 'string') {
    if ((config as ResourceConfig).source) return config as ResourceConfig;
    const legacy = config as any;
    if (legacy.type === 'image') {
      return { source: 'inline', format: 'image', data: legacy.data };
    }
    if (legacy.type === 'svg') {
      return {
        source: 'inline',
        format: 'svg',
        encoding: 'raw',
        data: legacy.data,
      };
    }
    if (legacy.type === 'remote') {
      return { source: 'remote', format: legacy.format, data: legacy.data };
    }
    if (legacy.type === 'search') {
      return {
        source: 'search',
        format: legacy.format || 'svg',
        data: legacy.data,
      };
    }
    if (legacy.type === 'custom') {
      return { source: 'custom', data: legacy.data };
    }
    return null;
  }

  const dataURIConfig = parseDataURI(config);
  if (dataURIConfig) return dataURIConfig;

  const refConfig = parseRefResource(config);
  if (refConfig) return refConfig;

  if (looksLikeSVG(config)) {
    return { source: 'inline', format: 'svg', encoding: 'raw', data: config };
  }

  return { source: 'custom', data: config };
}
