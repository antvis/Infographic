import type { IStateManager } from './state';

export interface ICommandManager {
  init(options: CommandManagerInitOptions): void;
  execute(command: ICommand): Promise<void>;
  executeBatch(commands: ICommand[]): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
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
