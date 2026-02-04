import type { ICommandManager } from './command';
import type { IInteractionManager } from './interaction';
import type { IPluginManager } from './plugin';
import type { IStateManager } from './state';
import type { ISyncRegistry, SyncHandler } from './sync';

export interface IEditor {
  commander: ICommandManager;
  interaction: IInteractionManager;
  plugin: IPluginManager;
  state: IStateManager;
  syncRegistry: ISyncRegistry;

  getDocument(): SVGSVGElement;
  registerSync(
    path: string,
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ): () => void;
  destroy(): void;
}
