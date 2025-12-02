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

    this.command = new CommandManager();
    this.state = new StateManager();
    this.plugin = new PluginManager();
    this.interaction = new InteractionManager();

    this.command.init(this.state);
    this.state.init(this, this.command, options.data);
    this.plugin.init(this, this.command, options.plugins);
    this.interaction.init(this, this.command, options.interactions);
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
