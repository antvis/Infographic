import type { ISyncRegistry, SyncHandler } from './sync';

export interface IEditor {
  syncRegistry: ISyncRegistry;

  getDocument(): SVGSVGElement;
  registerSync(
    path: string,
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ): () => void;
  destroy(): void;
}
