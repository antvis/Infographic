import type { RenderContext } from '../types';

export const createDefaultContext = (): RenderContext => ({
  defs: new Map(),
});
