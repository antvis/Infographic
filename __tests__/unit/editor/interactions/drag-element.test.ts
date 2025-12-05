import { describe, expect, it, vi } from 'vitest';
import { UpdateElementCommand } from '../../../../src/editor/commands';
import { DragElement } from '../../../../src/editor/interactions/drag-element';

const {
  clientToViewportMock,
  boundsMock,
  getEventTargetMock,
  isEditableTextMock,
  isEditingTextMock,
} = vi.hoisted(() => ({
  clientToViewportMock: vi.fn((_?: SVGSVGElement, x?: number, y?: number) => {
    if (!(global as any).DOMPoint) {
      (global as any).DOMPoint = class {
        x: number;
        y: number;
        constructor(px = 0, py = 0) {
          this.x = px;
          this.y = py;
        }
        matrixTransform() {
          return this;
        }
      };
    }
    return new DOMPoint(x, y);
  }),
  boundsMock: vi.fn(),
  getEventTargetMock: vi.fn(),
  isEditableTextMock: vi.fn(() => true),
  isEditingTextMock: vi.fn(() => false),
}));

vi.mock('../../../../src/editor/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/editor/utils');
  return {
    ...actual,
    clientToViewport: clientToViewportMock,
    getElementViewportBounds: (...args: any[]) => boundsMock(...args),
    getEventTarget: (...args: any[]) => getEventTargetMock(...args),
  };
});

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return {
    ...actual,
    isEditableText: () => isEditableTextMock(),
    isEditingText: () => isEditingTextMock(),
  };
});

describe('DragElement interaction', () => {
  it('drags editable text elements with snapping and commits commands', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svg, 'viewBox', {
      value: { baseVal: { width: 200, height: 200 } },
      writable: true,
    });
    document.body.appendChild(svg);

    const target = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    target.setAttribute('data-element-type', 'title');
    target.setAttribute('x', '0');
    target.setAttribute('y', '0');
    svg.appendChild(target);

    const guide = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    guide.setAttribute('data-element-type', 'item-icon');
    svg.appendChild(guide);

    boundsMock.mockImplementation((_: any, el: any) => {
      if (el === target) return new DOMRect(0, 0, 10, 10);
      if (el === guide) return new DOMRect(20, 0, 10, 10);
      return new DOMRect();
    });
    getEventTargetMock.mockImplementation((el: any) =>
      el === target ? target : null,
    );

    const select = vi.fn();
    const commander = { executeBatch: vi.fn() };
    const emitter = { emit: vi.fn() };
    const interaction = {
      isActive: () => true,
      isSelected: () => false,
      getSelection: () => [],
      select,
      appendTransientElement: (el: any) => {
        svg.appendChild(el);
        return el;
      },
      executeExclusiveInteraction: vi.fn(async (_instance: any, cb: any) =>
        cb(),
      ),
    };

    const instance = new DragElement();
    instance.init({
      emitter: emitter as any,
      editor: { getDocument: () => svg } as any,
      commander: commander as any,
      state: {} as any,
      interaction: interaction as any,
    });

    const startEvent = new PointerEvent('pointerdown', {
      pointerId: 1,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    Object.defineProperty(startEvent, 'target', { value: target });
    (instance as any).handleStart(startEvent);
    expect((instance as any).pointerId).toBe(1);
    (instance as any).handleMove(
      new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 21,
        clientY: 0,
      }),
    );
    expect((instance as any).dragging).toBe(true);
    (instance as any).handleEnd(
      new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 21,
        clientY: 0,
      }),
    );
    await Promise.resolve();

    expect(select).toHaveBeenCalledWith([target], 'replace');
    expect(target.getAttribute('x')).toBe('20');
    expect(target.getAttribute('y')).toBe('0');

    expect(commander.executeBatch).toHaveBeenCalledTimes(1);
    const [commands] = commander.executeBatch.mock.calls[0];
    expect(commands[0]).toBeInstanceOf(UpdateElementCommand);
    expect(commands[0].serialize().modified.attributes).toEqual(
      expect.objectContaining({ x: 20, y: 0 }),
    );
    expect(commands[0].serialize().original?.attributes).toEqual(
      expect.objectContaining({ x: 0, y: 0 }),
    );

    expect(emitter.emit).toHaveBeenCalledWith(
      'selection:geometrychange',
      expect.objectContaining({ type: 'selection:geometrychange' }),
    );

    instance.destroy();
  });
});
