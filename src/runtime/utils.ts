import { cloneDeep } from 'lodash-es';
import type { InfographicOptions, ParsedInfographicOptions } from '../options';
import { isNonNullableParsedDesignsOptions } from '../utils';

export function mergeOptions(
  object: Partial<InfographicOptions>,
  source: Partial<InfographicOptions>,
): Partial<InfographicOptions> {
  const base: Partial<InfographicOptions> = {
    ...object,
    ...source,
  };

  if (object.design || source.design) {
    base.design = { ...object.design, ...source.design };
  }
  if (object.themeConfig || source.themeConfig) {
    base.themeConfig = { ...object.themeConfig, ...source.themeConfig };
  }
  if (object.svg || source.svg) {
    base.svg = { ...object.svg, ...source.svg };
  }

  return base;
}

export function cloneOptions<T extends Partial<InfographicOptions>>(
  options: T,
): T {
  const cloned = { ...options };
  if (cloned.data) cloned.data = cloneDeep(cloned.data);
  if (cloned.elements) cloned.elements = cloneDeep(cloned.elements);
  return cloned as T;
}

export function isCompleteParsedInfographicOptions(
  options: Partial<ParsedInfographicOptions>,
): options is ParsedInfographicOptions {
  const { design, data } = options;
  if (!design) return false;
  if (!isNonNullableParsedDesignsOptions(design)) return false;
  if (!data) return false;
  if (!Array.isArray(data.items) || data.items.length < 1) return false;
  return true;
}
