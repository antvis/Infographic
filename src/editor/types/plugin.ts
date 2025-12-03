import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import { IStateManager } from './state';

export interface PluginManagerInitOptions {
  editor: IEditor;
  command: ICommandManager;
  state: IStateManager;
}

export interface PluginInitOptions {
  editor: IEditor;
  command: ICommandManager;
  plugin: IPluginManager;
  state: IStateManager;
}

export interface IPluginManager {
  init(options: PluginManagerInitOptions, plugins?: Plugin[]): void;
  getPlugin<T extends Plugin>(name: string): T | undefined;
  getPlugins(): ReadonlyMap<string, Plugin>;
  registerPlugin(plugin: Plugin): void;
  unregisterPlugin(name: string): void;
  destroy(): void;
}

export interface Plugin {
  name: string;
  init(options: PluginInitOptions): void;
  destroy(): void;
}
