import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InteractionManager } from '../../../../src/editor/managers/interaction';
import type { IEventEmitter } from '../../../../src/types';

const createEmitter = () => {
  const listeners = new Map<string, Set<(...args: any[]) => void>>();
  const emitter: IEventEmitter = {
    on: (event, listener) => {
      const set = listeners.get(String(event)) || new Set();
      set.add(listener);
      listeners.set(String(event), set);
      return emitter;
    },
    off: (event, listener) => {
      listeners.get(String(event))?.delete(listener);
      return emitter;
    },
    emit: vi.fn((event: string | symbol, ...args: any[]) => {
      listeners.get(String(event))?.forEach((fn) => fn(...args));
      return true;
    }),
    removeAllListeners: () => emitter,
  };
  return emitter as IEventEmitter & { listeners: typeof listeners };
};

describe('InteractionManager', () => {
  let emitter: ReturnType<typeof createEmitter>;
  let svg: SVGSVGElement;
  let editor: any;
  let commander: any;
  let state: any;

  beforeEach(() => {
    emitter = createEmitter();
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    editor = { getDocument: () => svg };
    commander = {};
    state = {};
  });

  it('registers interactions and tracks selection lifecycle', () => {
    const interaction = {
      name: 'foo',
      init: vi.fn(),
      destroy: vi.fn(),
    };
    const manager = new InteractionManager();
    manager.init({
      emitter,
      editor,
      commander,
      state,
      interactions: [interaction as any],
    });

    expect(interaction.init).toHaveBeenCalled();
    manager.select([svg as any], 'replace');
    expect(emitter.emit).toHaveBeenCalledWith(
      'selection:change',
      expect.objectContaining({
        added: [svg],
        removed: [],
        next: [svg],
        mode: 'replace',
      }),
    );

    manager.select([svg as any], 'toggle');
    expect(manager.getSelection()).toEqual([]);

    manager.destroy();
    expect(interaction.destroy).toHaveBeenCalled();
  });

  it('activates when clicking inside document and deactivates otherwise', () => {
    const manager = new InteractionManager();
    manager.init({
      emitter,
      editor,
      commander,
      state,
      interactions: [],
    });

    const mockEvent = { target: svg } as unknown as MouseEvent;
    (manager as any).handleClick(mockEvent);
    expect(manager.isActive()).toBe(true);

    (manager as any).handleClick({
      target: document.createElement('div'),
    } as unknown as MouseEvent);
    expect(manager.isActive()).toBe(false);
  });

  it('runs exclusive interactions only when active', async () => {
    const manager = new InteractionManager();
    manager.init({ state, emitter, editor, commander, interactions: [] });

    const run = vi.fn();
    await manager.executeExclusiveInteraction({ name: 'x' } as any, run);
    expect(run).not.toHaveBeenCalled();

    (manager as any).activate();
    await manager.executeExclusiveInteraction({ name: 'x' } as any, run);
    expect(run).toHaveBeenCalled();
  });

  it('appends transient elements under dedicated container', () => {
    const manager = new InteractionManager();
    manager.init({ emitter, editor, commander, state, interactions: [] });
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    const appended = manager.appendTransientElement(rect);
    expect(appended.parentElement?.getAttribute('data-element-type')).toBe(
      'transient-container',
    );
    expect(
      svg.querySelector('[data-element-type="transient-container"]'),
    ).not.toBeNull();
  });
});
