import type { IStateManager } from './state';

export interface ICommandManager {
  init(options: CommandManagerInitOptions): void;
  execute(command: Command): void;
  executeBatch(commands: Command[]): void;
  undo(): void;
  redo(): void;
  serialize(): any[];
  clear(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  getHistorySize(): number;
  destroy(): void;
}

export interface Command {
  apply(state: IStateManager): Promise<void>;
  undo(state: IStateManager): Promise<void>;
  serialize(): any;
}

export interface CommandManagerInitOptions {
  state: IStateManager;
}
