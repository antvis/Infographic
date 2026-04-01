import type { InfographicOptions, ParsedInfographicOptions } from '../options';
import type { Data } from '../types/data';

/**
 * Template options are the configuration subset used to define a template.
 * Templates receive data (via the Data interface) and options, then render an infographic.
 */
export type TemplateOptions = Omit<
  Partial<InfographicOptions>,
  'container' | 'template' | 'data'
>;

export type ParsedTemplateOptions = Omit<
  Partial<ParsedInfographicOptions>,
  'container' | 'template' | 'data'
>;

/**
 * The canonical data type that all templates consume.
 * This alias makes it explicit that templates work with the shared Data contract.
 */
export type TemplateData = Data;
