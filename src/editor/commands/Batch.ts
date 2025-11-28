import type { Command } from '../types';

export class BatchCommand implements Command {
  constructor(private commands: Command[]) {}

  async apply() {
    for (const command of this.commands) {
      await command.apply();
    }
  }

  async undo() {
    for (let i = this.commands.length - 1; i >= 0; i--) {
      await this.commands[i].undo();
    }
  }

  serialize() {
    return {
      type: 'batch',
      commands: this.commands.map((cmd) => cmd.serialize()),
    };
  }
}
