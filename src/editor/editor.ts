import type { ParsedInfographicOptions } from '../options';
import type { IEventEmitter } from '../types';
import {
  CommandManager,
  InteractionManager,
  PluginManager,
  StateManager,
} from './managers';
import type {
  ICommandManager,
  IEditor,
  IPluginManager,
  IStateManager,
} from './types';

export class Editor implements IEditor {
  state: IStateManager;
  commander: ICommandManager;
  plugin: IPluginManager;
  interaction: InteractionManager;

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
  }
}
