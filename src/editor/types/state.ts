import type { Data, Element, IEventEmitter, ItemDatum } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { ElementProps } from './shape';

export interface StateChangePayload {
  type: 'data:change';
  changes: StateChange[];
}

export interface StateChange {
  op: 'add' | 'remove' | 'update';
  role?: string;
  path: string;
  indexes?: number[];
  value: any;
}

export interface IStateManager {
  init(options: StateManagerInitOptions): void;
  addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void;
  updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void;
  removeItemDatum(indexes: number[], count?: number): void;
  updateData(key: string, value: any): void;
  updateElement(element: Element, props: Partial<ElementProps>): void;
  destroy(): void;
}

export interface StateManagerInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  data: Data;
}
