import type { Data, ItemDatum } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';

export interface StateChangePayload {
  type: 'data:change';
  changes: StateChange[];
}

export interface StateChange {
  op: 'add' | 'remove' | 'update';
  path: number[];
  value: any;
}

export interface IStateManager {
  init(editor: IEditor, command: ICommandManager, data: Data): void;
  addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void;
  updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void;
  removeItemDatum(indexes: number[], count?: number): void;
}
