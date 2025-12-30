import { setupDOM } from './dom-shim';
import { Infographic } from '../runtime/Infographic';
import type { InfographicOptions } from '../options';
import { parseSyntax, type SyntaxError } from '../syntax';
import type { Data, ItemDatum } from '../types';
import { preloadResource } from '../resource/loader';
import { exportToSVG } from '../exporter/svg';

export interface SSRRenderOptions {
  /** Input: Antv Infographic Syntax string */
  input: string;
  options?: Partial<InfographicOptions>;
}

export interface SSRRenderResult {
  /** SVG string */
  svg: string;
  /** Error list */
  errors: SyntaxError[];
  /** Warning list */
  warnings: SyntaxError[];
}

/**
 * Preload all icons and illus resources before rendering
 * This is necessary in SSR environment because loadResource is async
 */
async function preloadResources(
  data: Data,
): Promise<void> {
  const promises: Promise<void>[] = [];

  // Helper to collect all icons and illus from nested items
  function collectFromItem(item: ItemDatum) {
    if (item.icon) {
      promises.push(preloadResource('icon', item.icon!));
    }
    if (item.illus) {
      promises.push(preloadResource('illus', item.illus!));
    }
    if (item.children) {
      item.children.forEach(collectFromItem);
    }
  }

  // Collect from root level
  if (data.illus) {
    Object.values(data.illus).forEach((illus) => {
      if (illus) promises.push(preloadResource('illus', illus!));
    });
  }

  // Collect from all items
  if (data.items) {
    data.items.forEach(collectFromItem);
  }

  // Wait for all resources to load
  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

/**
 * Render infographic to SVG string in Node.js environment
 * Manually controls the rendering pipeline to preload resources before rendering
 */
export async function renderToSVG(
  options: SSRRenderOptions,
): Promise<SSRRenderResult> {
  // 1. Initialize linkedom environment
  const { document: globalDocument } = setupDOM();

  const errors: SyntaxError[] = [];
  const warnings: SyntaxError[] = [];

  // 2. Create virtual container (not added to DOM)
  const container = globalDocument.getElementById('container') as HTMLElement;

  // 3. Prepare options (disable editor for SSR)
  const ssrOptions: Partial<InfographicOptions> = {
    ...options.options,
    container,
    editable: false,
  };

  // 4. Create Infographic instance to parse options
  try {
    const { options: parsedOptions, errors: parseErrors, warnings: parseWarnings } = parseSyntax(options.input);
    errors.push(...parseErrors);
    warnings.push(...parseWarnings);
    if (!parsedOptions.data || !parsedOptions.data.items) {
      errors.push({
        code: 'bad_syntax',
        message: 'Invalid syntax: data.items is required',
        path: '',
        line: 0,
      } as SyntaxError);
      return { svg: '', errors, warnings };
    }
    // 5. Preload resources on rendering
    await preloadResources(parsedOptions.data || {});
    const infographic = new Infographic({ ...ssrOptions, ...parsedOptions });

    // Collect errors and warnings from event emitters
    infographic.on('error', (error: SyntaxError) => {
      errors.push(error);
    });
    infographic.on('warning', (warning: SyntaxError) => {
      warnings.push(warning);
    });
    const svgResultPromise = new Promise<string>((resolve, reject) => {
      infographic.on('rendered', async ({ node }) => {
        try {
          // 6. Export SVG after resources are preloaded
          const svg = await exportToSVG(node, { embedResources: true });
          const str = new XMLSerializer().serializeToString(svg);
          resolve(str);
        } catch (e) {
          reject(e);
        }
      });
    });
    infographic.render();
    const svg = await svgResultPromise;
    try {
      const svgo = await import('svgo');
      const optimized = svgo.optimize(svg);
      return { svg: optimized.data, errors, warnings };
    } catch (e) {
      // ignore svgo error
      return { svg, errors, warnings };
    }
  } catch (error) {
    errors.push({
      code: 'render_error',
      message: error instanceof Error ? error.message : 'Unknown render error',
      path: '',
      line: 0,
    } as any);
    return { svg: '', errors, warnings };
  }
}
