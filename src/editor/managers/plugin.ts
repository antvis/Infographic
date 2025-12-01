import type {
  ICommandManager,
  IEditor,
  IPluginManager,
  Plugin,
} from '../types';
import { Extension } from '../utils';

export class PluginManager implements IPluginManager {
  private extensions = new Extension<Plugin>();
  private editor!: IEditor;
  private command!: ICommandManager;

  init(editor: IEditor, command: ICommandManager, plugins: Plugin[] = []) {
    this.editor = editor;
    this.command = command;

    plugins.forEach((plugin) => {
      this.registerPlugin(plugin);
    });
  }

  getPlugin<T extends Plugin>(name: string): T | undefined {
    return this.extensions.get(name) as T | undefined;
  }

  getPlugins(): ReadonlyMap<string, Plugin> {
    return this.extensions.getAll();
  }

  registerPlugin(plugin: Plugin): void {
    this.extensions.register(plugin.name, plugin);
    plugin.init(this.editor, this.command, this);
    this.editor.emit('plugin:registered', plugin);
  }

  unregisterPlugin(name: string): void {
    const plugin = this.extensions.get(name);
    if (plugin) {
      plugin.destroy();
      this.extensions.unregister(name);
      this.editor.emit('plugin:unregistered', plugin);
    }
  }

  destroy(): void {
    this.extensions.getAll().forEach((plugin) => {
      this.unregisterPlugin(plugin.name);
      plugin.destroy();
      this.editor.emit('plugin:destroyed', plugin);
    });
    this.extensions.destroy();
  }
}
