import type { IEventEmitter } from '../../types';
import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { Selection } from './selection';
import type { IStateManager } from './state';

/**
 * 常见键位的联合类型，利用 (string & {}) 技巧实现补全建议且不限制具体字符串
 * 参考：https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
 */
export type KeyCode =
  | 'Space'
  | 'ShiftLeft'
  | 'ShiftRight'
  | 'ControlLeft'
  | 'ControlRight'
  | 'AltLeft'
  | 'AltRight'
  | 'MetaLeft'
  | 'MetaRight'
  | 'CapsLock'
  | 'Tab'
  | 'Enter'
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | `Key${string}`
  | `Digit${number}`
  | (string & {});

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

export interface viewBoxChangePayload {
  type: 'viewBox:change';
  viewBox: string | undefined;
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
