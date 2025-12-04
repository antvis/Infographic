import { BatchCommand } from '../commands';
import type {
  CommandManagerInitOptions,
  ICommand,
  ICommandManager,
  IStateManager,
} from '../types';

export class CommandManager implements ICommandManager {
  private state!: IStateManager;
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];

  init(options: CommandManagerInitOptions) {
    Object.assign(this, options);
  }

  execute(command: ICommand) {
    command.apply(this.state);
    this.undoStack.push(command);
    this.redoStack = [];
  }

  executeBatch(commands: ICommand[]) {
    if (commands.length === 0) return;

    const batchCommand = new BatchCommand(commands);
    this.execute(batchCommand);
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo(this.state);
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.apply(this.state);
      this.undoStack.push(command);
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
}
