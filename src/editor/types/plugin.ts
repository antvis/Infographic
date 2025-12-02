import type { ICommandManager } from './command';
import type { IEditor } from './editor';

export interface IPluginManager {
  init(editor: IEditor, command: ICommandManager, plugins?: Plugin[]): void;
  getPlugin<T extends Plugin>(name: string): T | undefined;
  getPlugins(): ReadonlyMap<string, Plugin>;
  registerPlugin(plugin: Plugin): void;
  unregisterPlugin(name: string): void;
  destroy(): void;
}

export interface Plugin {
  name: string;
  init(editor: IEditor, command: ICommandManager, plugin: IPluginManager): void;
  destroy(): void;
}
