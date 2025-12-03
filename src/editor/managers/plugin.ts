import type {
  IPluginManager,
  Plugin,
  PluginInitOptions,
  PluginManagerInitOptions,
} from '../types';
import { Extension } from '../utils';

export class PluginManager implements IPluginManager {
  private extensions = new Extension<Plugin>();

  private options!: PluginManagerInitOptions;

  init(relies: PluginManagerInitOptions, plugins: Plugin[] = []) {
    this.options = relies;
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
    const pluginInitOptions: PluginInitOptions = {
      editor: this.options.editor,
      command: this.options.command,
      plugin: this,
      state: this.options.state,
    };
    plugin.init(pluginInitOptions);
    this.options.editor.emit('plugin:registered', plugin);
  }

  unregisterPlugin(name: string): void {
    const plugin = this.extensions.get(name);
    if (plugin) {
      plugin.destroy();
      this.extensions.unregister(name);
      this.options.editor.emit('plugin:unregistered', plugin);
    }
  }

  destroy(): void {
    this.extensions.getAll().forEach((plugin) => {
      this.unregisterPlugin(plugin.name);
      plugin.destroy();
      this.options.editor.emit('plugin:destroyed', plugin);
    });
    this.extensions.destroy();
  }
}
