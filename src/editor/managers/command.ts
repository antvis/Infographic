import type { IEventEmitter } from '../../types';
import { BatchCommand } from '../commands';
import type {
  CommandManagerInitOptions,
  ICommand,
  ICommandManager,
  IStateManager,
} from '../types';

export class CommandManager implements ICommandManager {
  private emitter!: IEventEmitter;
  private state!: IStateManager;
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];

  init(options: CommandManagerInitOptions) {
    Object.assign(this, options);
  }

  async execute(command: ICommand) {
    await command.apply(this.state);
    this.undoStack.push(command);
    this.redoStack = [];
  }

  async executeBatch(commands: ICommand[]) {
    if (commands.length === 0) return;

    const batchCommand = new BatchCommand(commands);
    await this.execute(batchCommand);
  }

  async undo() {
    const command = this.undoStack.pop();
    if (command) {
      await command.undo(this.state);
      this.redoStack.push(command);
      this.emitHistoryChange('undo');
    }
  }

  async redo() {
    const command = this.redoStack.pop();
    if (command) {
      await command.apply(this.state);
      this.undoStack.push(command);
      this.emitHistoryChange('redo');
    }
  }

  serialize(): any[] {
    return this.undoStack.map((cmd) => cmd.serialize());
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getHistorySize(): number {
    return this.undoStack.length;
  }

  destroy() {
    this.clear();
  }

  private emitHistoryChange(action: 'undo' | 'redo') {
    this.emitter?.emit('history:change', {
      type: 'history:change',
      action,
    });
  }
}
