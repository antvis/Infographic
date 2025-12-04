import type { IEventEmitter } from '../../types';
import type {
  ICommandManager,
  IEditor,
  IPlugin,
  IPluginManager,
  IStateManager,
  PluginInitOptions,
} from '../types';

export abstract class Plugin implements IPlugin {
  abstract name: string;

  protected emitter!: IEventEmitter;
  protected editor!: IEditor;
  protected commander!: ICommandManager;
  protected plugin!: IPluginManager;
  protected state!: IStateManager;

  init(options: PluginInitOptions): void {
    Object.assign(this, options);
  }

  abstract destroy(): void;
}
