import type { ResourceConfig } from '../types';
import { parseDataURI } from './data-uri';
import { getSimpleHash } from './hash';

export function getResourceId(config: string | ResourceConfig): string | null {
  const cfg = typeof config === 'string' ? parseDataURI(config) : config;
  if (!cfg) return null;
  return getSimpleHash(JSON.stringify(cfg));
}

export function getResourceHref(config: string | ResourceConfig) {
  const id = getResourceId(config);
  if (!id) return null;
  return `#${id}`;
}
