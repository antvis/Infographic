import type { ICommand, IStateManager } from '../types';

export class BatchCommand implements ICommand {
  constructor(private commands: ICommand[]) {}

  async apply(state: IStateManager) {
    for (const command of this.commands) {
      await command.apply(state);
    }
  }

  async undo(state: IStateManager) {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      await this.commands[i].undo(state);
    }
  }

  serialize() {
    return {
      type: 'batch',
      commands: this.commands.map((cmd) => cmd.serialize()),
    };
  }
}
