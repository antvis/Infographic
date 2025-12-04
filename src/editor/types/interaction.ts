import type { IEventEmitter } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { Selection } from './selection';
import type { IStateManager } from './state';

export interface IInteraction {
  name: string;
  init(options: InteractionInitOptions): void;
  destroy(): void;
}

export type SelectMode = 'replace' | 'add' | 'remove' | 'toggle';

export interface SelectionChangePayload {
  type: 'selection:change';
  previous: Selection;
  next: Selection;
  added: Selection;
  removed: Selection;
  mode: SelectMode;
}

export interface IInteractionManager {
  isActive(): boolean;
  select(items: Selection, mode: SelectMode): void;
  getSelection(): Selection;
  isSelected(item: Selection[number]): boolean;
  clearSelection(): void;
  executeExclusiveInteraction(
    instance: IInteraction,
    callback: () => Promise<void>,
  ): Promise<void>;
  executeConcurrentInteraction(
    instance: IInteraction,
    callback: () => Promise<void>,
  ): Promise<void>;
  appendTransientElement<T extends SVGElement>(element: T): T;
  destroy(): void;
}

export interface InteractionInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  state: IStateManager;
  interaction: IInteractionManager;
}

export interface InteractionManagerInitOptions {
  emitter: IEventEmitter;
  editor: IEditor;
  commander: ICommandManager;
  state: IStateManager;
  interactions?: IInteraction[];
}
