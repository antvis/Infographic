import type { IEventEmitter } from '../../types';
import {
  createElement,
  getElementByRole,
  isInfographicComponent,
  setElementRole,
} from '../../utils';
import type {
  ICommandManager,
  IEditor,
  IInteraction,
  IInteractionManager,
  InteractionManagerInitOptions,
  IStateManager,
  Selection,
  SelectionChangePayload,
  SelectMode,
} from '../types';
import { Extension } from '../utils';

export class InteractionManager implements IInteractionManager {
  private extensions = new Extension<IInteraction>();
  private emitter!: IEventEmitter;
  private editor!: IEditor;
  private commander!: ICommandManager;
  private state!: IStateManager;
  private interactions: IInteraction[] = [];

  private active = false;
  private running: IInteraction | null = null;
  private concurrentInteractions: Set<IInteraction> = new Set();
  private selection: Set<Selection[number]> = new Set();

  init(options: InteractionManagerInitOptions) {
    Object.assign(this, options);
    document.addEventListener('click', this.handleClick);

    this.interactions.forEach((interaction) => {
      this.extensions.register(interaction.name, interaction);
      interaction.init({
        emitter: this.emitter,
        editor: this.editor,
        commander: this.commander,
        state: this.state,
        interaction: this,
      });
      this.emitter.emit('interaction:registered', interaction);
    });
  }

  isActive() {
    return this.active;
  }

  select(items: Selection, mode: SelectMode) {
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
      type: 'selection:change',
      previous,
      next,
      added,
      removed,
      mode,
    };
    this.emitter.emit('selection:change', payload);
  }

  getSelection() {
    return [...this.selection];
  }

  isSelected(item: Selection[number]) {
    return this.selection.has(item);
  }

  clearSelection() {
    const previous = this.getSelection();
    this.selection.clear();

    const payload: SelectionChangePayload = {
      type: 'selection:change',
      previous,
      next: [],
      added: [],
      removed: previous,
      mode: 'replace',
    };

    this.emitter.emit('selection:change', payload);
  }

  private handleClick = (event: MouseEvent) => {
    const doc = this.editor.getDocument();
    const target = event.target;

    if (!target) {
      this.deactivate();
      return;
    }
    // 点击画布 SVG 或者标记为组件的元素
    if (
      doc.contains(target as Node) ||
      isInfographicComponent(target as HTMLElement)
    )
      this.activate();
    else this.deactivate();
  };

  private activate() {
    this.active = true;
    this.emitter.emit('activated');
  }

  private deactivate() {
    this.active = false;
    this.running = null;
    this.clearSelection();
    this.emitter.emit('deactivated');
  }

  /**
   * 执行互斥交互操作（同一时间只能有一个互斥交互在进行）
   */
  async executeExclusiveInteraction(
    instance: IInteraction,
    callback: () => Promise<void>,
  ) {
    // 如果未激活或已有互斥交互在运行，则拒绝执行
    if (!this.active || this.running) return;

    this.running = instance;

    try {
      this.emitter.emit('interaction:started', instance);
      await callback();
      this.emitter.emit('interaction:ended', instance);
    } catch (error) {
      console.error(
        `Error occurred during exclusive interaction "${instance.name}":`,
        error,
      );
      this.emitter.emit('interaction:error', instance, error);
    } finally {
      this.running = null;
    }
  }

  /**
   * 执行协同交互操作（允许多个协同交互同时进行）
   */
  async executeConcurrentInteraction(
    instance: IInteraction,
    callback: () => Promise<void>,
  ) {
    if (!this.active) return;

    this.concurrentInteractions.add(instance);

    try {
      this.emitter.emit('interaction:started', instance);
      await callback();
      this.emitter.emit('interaction:ended', instance);
    } catch (error) {
      console.error(
        `Error occurred during concurrent interaction "${instance.name}":`,
        error,
      );
      this.emitter.emit('interaction:error', instance, error);
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
    this.extensions.forEach((interaction) => {
      interaction.destroy();
      this.emitter.emit('interaction:destroyed', interaction);
    });
    this.extensions.destroy();

    this.active = false;
    this.running = null;
    this.clearSelection();

    document.removeEventListener('click', this.handleClick);
    this.getOrCreateTransientContainer().remove();
  }
}
