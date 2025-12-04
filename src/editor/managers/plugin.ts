import { IEventEmitter } from '../../types';
import type {
  ICommandManager,
  IEditor,
  IPlugin,
  IPluginManager,
  IStateManager,
  PluginInitOptions,
  PluginManagerInitOptions,
} from '../types';
import { Extension } from '../utils';

export class PluginManager implements IPluginManager {
  private extensions = new Extension<IPlugin>();

  private emitter!: IEventEmitter;
  private editor!: IEditor;
  private commander!: ICommandManager;
  private state!: IStateManager;

  init(options: PluginManagerInitOptions, plugins: IPlugin[] = []) {
    Object.assign(this, options);

    plugins.forEach((plugin) => {
      this.registerPlugin(plugin);
    });
  }

  getPlugin<T extends IPlugin>(name: string): T | undefined {
    return this.extensions.get(name) as T | undefined;
  }

  getPlugins(): ReadonlyMap<string, IPlugin> {
    return this.extensions.getAll();
  }

  registerPlugin(plugin: IPlugin): void {
    this.extensions.register(plugin.name, plugin);
    const pluginInitOptions: PluginInitOptions = {
      emitter: this.emitter,
      editor: this.editor,
      commander: this.commander,
      plugin: this,
      state: this.state,
    };
    plugin.init(pluginInitOptions);
    this.emitter.emit('plugin:registered', plugin);
  }

  unregisterPlugin(name: string): void {
    const plugin = this.extensions.get(name);
    if (plugin) {
      plugin.destroy();
      this.extensions.unregister(name);
      this.emitter.emit('plugin:unregistered', plugin);
    }
  }

  destroy(): void {
    this.extensions.getAll().forEach((plugin) => {
      this.unregisterPlugin(plugin.name);
      this.emitter.emit('plugin:destroyed', plugin);
    });
    this.extensions.destroy();
  }
}
