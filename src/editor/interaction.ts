import { createElement, getElementByRole, setElementRole } from '../utils';
import { CommandManager } from './command';
import type { Editor } from './editor';
import type { Interaction, Selection } from './types';
import { Extension } from './utils/extension';

type Mode = 'replace' | 'add' | 'remove' | 'toggle';

interface SelectionChangePayload {
  previous: Selection;
  next: Selection;
  added: Selection;
  removed: Selection;
  mode: Mode;
}

export interface IInteractionManager {
  isActive(): boolean;
  select(items: Selection, mode: Mode): void;
  getSelection(): Selection;
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

export class InteractionManager implements IInteractionManager {
  extensions = new Extension<Interaction>();

  constructor(
    private editor: Editor,
    command: CommandManager,
    interactions: Interaction[],
  ) {
    this.init();
    interactions.forEach((interaction) => {
      this.extensions.register(interaction.name, interaction);
      interaction.init(editor, command, this);
    });
  }

  private active = false;
  private running: Interaction | null = null;
  private concurrentInteractions: Set<Interaction> = new Set();
  private selection: Set<Selection[number]> = new Set();

  init() {
    document.addEventListener('click', this.handleClick);
  }

  isActive() {
    return this.active;
  }

  select(items: Selection, mode: Mode) {
    const previous = this.getSelection();
    const added: Selection = [];
    const removed: Selection = [];

    if (mode === 'replace') {
      const next = new Set(items);
      previous.forEach((id) => {
        if (!next.has(id)) removed.push(id);
      });
      items.forEach((id) => {
        if (!this.selection.has(id)) added.push(id);
      });
      this.selection = next;
    } else if (mode === 'add') {
      items.forEach((id) => {
        if (!this.selection.has(id)) {
          this.selection.add(id);
          added.push(id);
        }
      });
    } else if (mode === 'remove') {
      items.forEach((id) => {
        if (this.selection.delete(id)) {
          removed.push(id);
        }
      });
    } else if (mode === 'toggle') {
      items.forEach((id) => {
        if (this.selection.has(id)) {
          this.selection.delete(id);
          removed.push(id);
        } else {
          this.selection.add(id);
          added.push(id);
        }
      });
    }

    const next = this.getSelection();
    const payload: SelectionChangePayload = {
      previous,
      next,
      added,
      removed,
      mode,
    };
    console.log(payload);
    this.editor.emit('selection:change', payload);
  }

  getSelection() {
    return [...this.selection];
  }

  clearSelection() {
    const previous = this.getSelection();
    this.selection.clear();

    const payload: SelectionChangePayload = {
      previous,
      next: [],
      added: [],
      removed: previous,
      mode: 'replace',
    };

    this.editor.emit('selection:change', payload);
  }

  private handleClick = (event: MouseEvent) => {
    const doc = this.editor.getDocument();
    const target = event.target as Node;
    if (doc.contains(target)) this.activate();
    else this.deactivate();
  };

  private activate() {
    this.active = true;
    this.editor.emit('activated');
  }

  private deactivate() {
    this.active = false;
    this.running = null;
    this.clearSelection();
    this.editor.emit('deactivated');
  }

  /**
   * 执行互斥交互操作（同一时间只能有一个互斥交互在进行）
   */
  async executeExclusiveInteraction(
    instance: Interaction,
    callback: () => Promise<void>,
  ) {
    // 如果未激活或已有互斥交互在运行，则拒绝执行
    if (!this.active || this.running) return;

    this.running = instance;

    try {
      await callback();
    } catch (error) {
      console.error(
        `Error occurred during exclusive interaction "${name}":`,
        error,
      );
    } finally {
      this.running = null;
    }
  }

  /**
   * 执行协同交互操作（允许多个协同交互同时进行）
   */
  async executeConcurrentInteraction(
    instance: Interaction,
    callback: () => Promise<void>,
  ) {
    if (!this.active) return;

    this.concurrentInteractions.add(instance);

    try {
      await callback();
    } catch (error) {
      console.error(
        `Error occurred during concurrent interaction "${name}":`,
        error,
      );
    } finally {
      this.concurrentInteractions.delete(instance);
    }
  }

  private getOrCreateTransientContainer() {
    const role = 'transient-container';
    const doc = this.editor.getDocument();
    const container = getElementByRole(doc, role);
    if (container && container.isConnected) return container;

    const g = createElement('g');
    setElementRole(g, role);
    doc.appendChild(g);
    return g;
  }

  appendTransientElement<T extends SVGElement>(element: T): T {
    const container = this.getOrCreateTransientContainer();
    container.appendChild(element);
    return element;
  }

  destroy() {
    this.active = false;
    this.running = null;
    this.clearSelection();

    document.removeEventListener('click', this.handleClick);
    this.getOrCreateTransientContainer().remove();
  }
}
