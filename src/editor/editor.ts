import { get } from 'lodash-es';
import type { ParsedInfographicOptions } from '../options';
import type { IEventEmitter } from '../types';
import { parsePadding, setSVGPadding } from '../utils';
import {
  CommandManager,
  InteractionManager,
  PluginManager,
  StateManager,
} from './managers';
import { SyncRegistry } from './managers/sync-registry';
import type {
  ICommandManager,
  IEditor,
  IPluginManager,
  IStateManager,
  ISyncRegistry,
  SyncHandler,
} from './types';

export class Editor implements IEditor {
  state: IStateManager;
  commander: ICommandManager;
  plugin: IPluginManager;
  interaction: InteractionManager;
  syncRegistry: ISyncRegistry;

  constructor(
    private emitter: IEventEmitter,
    private document: SVGSVGElement,
    private options: ParsedInfographicOptions,
  ) {
    if (!document.isConnected) {
      throw new Error('The provided document is not connected to the DOM.');
    }
    document.style.userSelect = 'none';

    const commander = new CommandManager();
    const state = new StateManager();
    const plugin = new PluginManager();
    const interaction = new InteractionManager();

    const syncRegistry = new SyncRegistry((path) =>
      get(state.getOptions(), path),
    );

    commander.init({ state, emitter });
    state.init({
      emitter,
      editor: this,
      commander,
      options,
    });
    plugin.init(
      {
        emitter,
        editor: this,
        commander,
        state,
      },
      options.plugins,
    );
    interaction.init({
      emitter,
      editor: this,
      commander,
      state,
      interactions: options.interactions,
    });

    this.commander = commander;
    this.state = state;
    this.plugin = plugin;
    this.interaction = interaction;
    this.syncRegistry = syncRegistry;

    this.registerSync(
      'viewBox',
      (val) => {
        val
          ? document.setAttribute('viewBox', val)
          : document.removeAttribute('viewBox');
      },
      { immediate: true },
    );

    this.registerSync(
      'padding',
      (val) => {
        if (val !== undefined) setSVGPadding(document, parsePadding(val));
      },
      { immediate: true },
    );
  }

  registerSync(
    path: string,
    handler: SyncHandler,
    options?: { immediate?: boolean },
  ) {
    return this.syncRegistry.register(path, handler, options);
  }

  getDocument() {
    return this.document;
  }

  destroy() {
    this.document.style.userSelect = '';
    this.interaction.destroy();
    this.plugin.destroy();
    this.commander.destroy();
    this.state.destroy();
    this.syncRegistry.destroy();
  }
}
