import EventEmitter from 'eventemitter3';
import type { ParsedInfographicOptions } from '../options';
import { CommandManager } from './command';
import { InteractionManager } from './interaction';

export interface IEditor {
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  emit(event: string | symbol, ...args: any[]): boolean;
  off(event: string | symbol, listener: (...args: any[]) => void): this;
  getDocument(): SVGSVGElement;
}

export class Editor extends EventEmitter implements IEditor {
  command: CommandManager;

  interaction: InteractionManager;

  constructor(
    private document: SVGSVGElement,
    private options: ParsedInfographicOptions,
  ) {
    super();

    if (!document.isConnected) {
      throw new Error('The provided document is not connected to the DOM.');
    }
    this.command = new CommandManager();
    this.interaction = new InteractionManager(
      this,
      this.command,
      options.interactions || [],
    );
  }

  getDocument() {
    return this.document;
  }
}
