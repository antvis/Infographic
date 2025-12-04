import type { IEventEmitter } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { IStateManager } from './state';

export interface IPluginManager {
  init(options: PluginManagerInitOptions, plugins?: IPlugin[]): void;
  getPlugin<T extends IPlugin>(name: string): T | undefined;
  getPlugins(): ReadonlyMap<string, IPlugin>;
  registerPlugin(plugin: IPlugin): void;
  unregisterPlugin(name: string): void;
  destroy(): void;
}

export interface IPlugin {
  name: string;
  init(options: PluginInitOptions): void;
  destroy(): void;
}

export interface PluginManagerInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  state: IStateManager;
}

export interface PluginInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  plugin: IPluginManager;
  state: IStateManager;
}
