import type { ResourceConfig } from '../types';
import { parseDataURI } from './data-uri';

export function parseResourceConfig(
  config: string | ResourceConfig,
): ResourceConfig | null {
  if (!config) return null;
  return typeof config === 'string' ? parseDataURI(config) : config;
}
