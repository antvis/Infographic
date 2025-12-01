import type { ICommandManager } from './command';
import type { IEditor } from './editor';
import type { Selection } from './selection';

export interface Interaction {
  name: string;
  init(
    editor: IEditor,
    command: ICommandManager,
    interaction: IInteractionManager,
  ): void;
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
    instance: Interaction,
    callback: () => Promise<void>,
  ): Promise<void>;
  executeConcurrentInteraction(
    instance: Interaction,
    callback: () => Promise<void>,
  ): Promise<void>;
  appendTransientElement<T extends SVGElement>(element: T): T;
  destroy(): void;
}
