import { getSimpleHash } from '../../utils';
import type { ResourceConfig } from '../types';
import { parseResourceConfig } from './parser';

export function getResourceId(config: string | ResourceConfig): string | null {
  const cfg = typeof config === 'string' ? parseResourceConfig(config) : config;
  if (!cfg) return null;
  return 'rsc-' + getSimpleHash(JSON.stringify(cfg));
}

export function getResourceHref(config: string | ResourceConfig) {
  const id = getResourceId(config);
  if (!id) return null;
  return `#${id}`;
}
