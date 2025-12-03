import EventEmitter from 'eventemitter3';
import type { ParsedInfographicOptions } from '../options';
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

export class Editor extends EventEmitter implements IEditor {
  state: IStateManager;
  command: ICommandManager;
  plugin: IPluginManager;
  interaction: InteractionManager;

  constructor(
    private document: SVGSVGElement,
    private options: ParsedInfographicOptions,
  ) {
    super();

    if (!document.isConnected) {
      throw new Error('The provided document is not connected to the DOM.');
    }
    document.style.userSelect = 'none';

    const command = new CommandManager();
    const state = new StateManager();
    const plugin = new PluginManager();
    const interaction = new InteractionManager();

    command.init({ state });
    state.init({ editor: this, command, data: options.data });
    plugin.init(
      {
        editor: this,
        command: command,
        state: state,
      },
      options.plugins,
    );
    interaction.init({
      editor: this,
      command,
      interactions: options.interactions,
    });

    this.command = command;
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
    this.command.destroy();
    this.state.destroy();
    this.removeAllListeners();
  }
}
