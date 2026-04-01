import type { Data } from './data';

/**
 * Template category classification.
 * Each template belongs to one of these structural categories.
 */
export type TemplateCategory =
  | 'list'
  | 'compare'
  | 'sequence'
  | 'hierarchy'
  | 'relation'
  | 'geo'
  | 'chart';

/**
 * Template metadata describing its purpose and characteristics.
 */
export interface TemplateMetadata {
  /** Unique template identifier */
  id: string;
  /** Human-readable template name */
  name: string;
  /** Structural category this template belongs to */
  category: TemplateCategory;
  /** Optional description of the template's use case */
  description?: string;
  /** Optional keywords for searchability */
  tags?: string[];
}

/**
 * The core template contract.
 * All infographic templates should conform to this interface.
 * 
 * @example
 * ```ts
 * const myTemplate: Template = {
 *   metadata: {
 *     id: 'list-simple',
 *     name: 'Simple List',
 *     category: 'list'
 *   },
 *   render: (data: Data, options) => {
 *     // render logic
 *   }
 * };
 * ```
 */
export interface Template<TOptions = any> {
  /** Template metadata */
  metadata: TemplateMetadata;
  /** Render function that takes data and returns an infographic representation */
  render: (data: Data, options?: TOptions) => any;
}
