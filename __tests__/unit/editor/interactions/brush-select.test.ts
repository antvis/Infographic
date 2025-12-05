import { describe, expect, it, vi } from 'vitest';
import { BrushSelect } from '../../../../src/editor/interactions/brush-select';

const { clientToViewportMock, boundsMock, getEventTargetMock } = vi.hoisted(
  () => {
    if (!(global as any).DOMPoint) {
      (global as any).DOMPoint = class {
        x: number;
        y: number;
        constructor(x = 0, y = 0) {
          this.x = x;
          this.y = y;
        }
        matrixTransform() {
          return this;
        }
      };
    }
    return {
      clientToViewportMock: vi.fn(
        (_: SVGSVGElement, x: number, y: number) => new DOMPoint(x, y),
      ),
      boundsMock: vi.fn(),
      getEventTargetMock: vi.fn(),
    };
  },
);

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
    isEditableText: vi.fn(() => true),
    isIconElement: vi.fn(() => false),
  };
});

describe('BrushSelect interaction', () => {
  it('selects intersecting elements and respects shift additive mode', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    element.setAttribute('data-element-type', 'title');
    svg.appendChild(element);

    boundsMock.mockImplementation(() => new DOMRect(2, 2, 4, 4));
    getEventTargetMock.mockReturnValue(null);

    const select = vi.fn();
    const interaction = {
      isActive: () => true,
      select,
      clearSelection: vi.fn(),
      appendTransientElement: (el: any) => {
        svg.appendChild(el);
        return el;
      },
      executeExclusiveInteraction: vi.fn(async (_instance: any, cb: any) =>
        cb(),
      ),
    };

    const instance = new BrushSelect();
    instance.init({
      emitter: {} as any,
      editor: { getDocument: () => svg } as any,
      commander: {} as any,
      state: {} as any,
      interaction: interaction as any,
    });

    const pointerDown = new PointerEvent('pointerdown', {
      pointerId: 1,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    Object.defineProperty(pointerDown, 'target', { value: svg });
    (instance as any).handleStart(pointerDown);
    expect((instance as any).pointerId).toBe(1);
    (instance as any).handleMove(
      new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 10,
        clientY: 10,
      }),
    );
    expect((instance as any).dragging).toBe(true);
    (instance as any).handleEnd(
      new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 10,
        clientY: 10,
      }),
    );
    await Promise.resolve();
    expect(select).toHaveBeenCalledWith([element], 'replace');

    select.mockClear();
    const pointerDownShift = new PointerEvent('pointerdown', {
      pointerId: 2,
      button: 0,
      clientX: 0,
      clientY: 0,
      shiftKey: true,
    });
    Object.defineProperty(pointerDownShift, 'target', { value: svg });
    (instance as any).handleStart(pointerDownShift);
    (instance as any).handleMove(
      new PointerEvent('pointermove', {
        pointerId: 2,
        clientX: 5,
        clientY: 5,
        shiftKey: true,
      }),
    );
    (instance as any).handleEnd(
      new PointerEvent('pointerup', {
        pointerId: 2,
        clientX: 5,
        clientY: 5,
        shiftKey: true,
      }),
    );
    await Promise.resolve();
    expect(select).toHaveBeenCalledWith([element], 'add');

    instance.destroy();
  });

  it('clears selection when nothing is brushed without shift', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    element.setAttribute('data-element-type', 'title');
    svg.appendChild(element);

    boundsMock.mockImplementation(() => new DOMRect(100, 100, 10, 10));
    getEventTargetMock.mockReturnValue(null);

    const clearSelection = vi.fn();
    const select = vi.fn();
    const interaction = {
      isActive: () => true,
      select,
      clearSelection,
      appendTransientElement: (el: any) => {
        svg.appendChild(el);
        return el;
      },
      executeExclusiveInteraction: vi.fn(async (_instance: any, cb: any) =>
        cb(),
      ),
    };

    const instance = new BrushSelect();
    instance.init({
      emitter: {} as any,
      editor: { getDocument: () => svg } as any,
      commander: {} as any,
      state: {} as any,
      interaction: interaction as any,
    });

    const startEvent = new PointerEvent('pointerdown', {
      pointerId: 3,
      button: 0,
      clientX: 0,
      clientY: 0,
    });
    Object.defineProperty(startEvent, 'target', { value: svg });
    (instance as any).handleStart(startEvent);
    (instance as any).handleMove(
      new PointerEvent('pointermove', {
        pointerId: 3,
        clientX: 10,
        clientY: 10,
      }),
    );
    (instance as any).handleEnd(
      new PointerEvent('pointerup', {
        pointerId: 3,
        clientX: 10,
        clientY: 10,
      }),
    );
    await Promise.resolve();
    expect(select).not.toHaveBeenCalled();
    expect(clearSelection).toHaveBeenCalled();

    instance.destroy();
  });
});
