import type { IStateManager } from './state';

export interface ICommandManager {
  init(options: CommandManagerInitOptions): void;
  execute(command: ICommand): void;
  executeBatch(commands: ICommand[]): void;
  undo(): void;
  redo(): void;
  serialize(): any[];
  clear(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  getHistorySize(): number;
  destroy(): void;
}

export interface ICommand {
  apply(state: IStateManager): Promise<void>;
  undo(state: IStateManager): Promise<void>;
  serialize(): any;
}

export interface CommandManagerInitOptions {
  state: IStateManager;
}
