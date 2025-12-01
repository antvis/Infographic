import EventEmitter from 'eventemitter3';
import type { ParsedInfographicOptions } from '../options';
import { CommandManager, InteractionManager, StateManager } from './managers';
import type { ICommandManager, IEditor, IStateManager } from './types';

export class Editor extends EventEmitter implements IEditor {
  state: IStateManager;
  command: ICommandManager;

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
    this.interaction = new InteractionManager();

    this.command.init(this.state);
    this.state.init(this, this.command, options.data);
    this.interaction.init(this, this.command, options.interactions);
  }

  getDocument() {
    return this.document;
  }

  destroy() {
    this.document.style.userSelect = '';
  }
}
