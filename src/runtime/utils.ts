import { InfographicOptions } from '../options/types';

export function mergeOptions(
  object: Partial<InfographicOptions>,
  source: Partial<InfographicOptions>,
): InfographicOptions {
  return {
    ...object,
    ...source,
    design: {
      ...object.design,
      ...source.design,
    },
    themeConfig: {
      ...object.themeConfig,
      ...source.themeConfig,
    },
    svg: {
      ...object.svg,
      ...source.svg,
    },
  } as InfographicOptions;
}
