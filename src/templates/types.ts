import type { InfographicOptions, ParsedInfographicOptions } from '../options';

export type TemplateOptions = Omit<
  Partial<InfographicOptions>,
  'container' | 'template' | 'data'
>;

export type ParsedTemplateOptions = Omit<
  Partial<ParsedInfographicOptions>,
  'container' | 'template' | 'data'
>;
