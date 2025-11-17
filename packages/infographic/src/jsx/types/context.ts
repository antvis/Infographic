import type { JSXElement } from './jsx';

export interface RenderContext {
  defs: Map<string, JSXElement>;
}
