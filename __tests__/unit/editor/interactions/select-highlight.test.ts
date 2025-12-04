import { describe, expect, it, vi } from 'vitest';
import { SelectHighlight } from '../../../../src/editor/interactions/select-highlight';

const boundsMock = vi.fn();

vi.mock('../../../../src/editor/utils/coordinate', async () => {
  const actual = await vi.importActual<any>(
    '../../../../src/editor/utils/coordinate',
  );
  return {
    ...actual,
    getElementViewportBounds: (...args: any[]) => boundsMock(...args),
  };
});

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return { ...actual, isEditableText: vi.fn(() => false) };
});

describe('SelectHighlight', () => {
  it('draws highlight masks for selection and clears when single editable text', async () => {
    const emitter = (() => {
      const listeners = new Map<string, Set<(...args: any[]) => void>>();
      return {
        on: (event: any, listener: any) => {
          const set = listeners.get(event) || new Set();
          set.add(listener);
          listeners.set(event, set);
        },
        off: (event: any, listener: any) =>
          listeners.get(event)?.delete(listener),
        emit: (event: any, payload: any) =>
          listeners.get(event)?.forEach((fn) => fn(payload)),
      };
    })();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    const rectA = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    const rectB = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    boundsMock.mockImplementation((_, element: any) =>
      element === rectA
        ? new DOMRect(0, 0, 10, 10)
        : new DOMRect(10, 10, 10, 10),
    );

    const appended: SVGElement[] = [];
    const interaction = {
      getSelection: () => [rectA, rectB],
      isSelected: (el: any) => el === rectA || el === rectB,
      appendTransientElement: (el: any) => {
        svg.appendChild(el);
        appended.push(el);
        return el;
      },
    };

    const instance = new SelectHighlight();
    instance.init({
      emitter: emitter as any,
      editor: { getDocument: () => svg } as any,
      commander: {} as any,
      state: {} as any,
      interaction: interaction as any,
    });

    expect(appended.length).toBeGreaterThanOrEqual(2);

    // simulate single editable text selection which should clear masks
    const { isEditableText } = await import('../../../../src/utils');
    (isEditableText as any).mockReturnValue(true);
    emitter.emit('selection:change', {
      next: [rectA],
      previous: [],
      added: [rectA],
      removed: [],
      mode: 'replace',
    });
    expect(svg.querySelectorAll('rect').length).toBe(0);

    instance.destroy();
  });
});
