import type { ParsedInfographicOptions } from '../../options';
import type { Element, IEventEmitter, ItemDatum } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { ElementProps } from './shape';

export interface StateChangePayload {
  type: 'options:change';
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
  updateOptions(options: ParsedInfographicOptions): void;
  getOptions(): ParsedInfographicOptions;
  destroy(): void;
}

export interface StateManagerInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  options?: ParsedInfographicOptions;
}

export interface StateEventPayloadMap {
  'options:change': StateChangePayload;
  'options:data:item:add': {
    indexes: number[];
    datum: ItemDatum | ItemDatum[];
  };
  'options:data:item:update': { indexes: number[]; datum: Partial<ItemDatum> };
  'options:data:item:remove': { indexes: number[]; datum: ItemDatum[] };
  'options:data:update': { key: string; value: any };
  'options:element:update': { element: Element; props: Partial<ElementProps> };
}

export type StateEventName = keyof StateEventPayloadMap;
