import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DblClickEditText } from '../../../../src/editor/interactions/dblclick-edit-text';

const { getEventTargetMock, isEditableTextMock } = vi.hoisted(() => ({
  getEventTargetMock: vi.fn((el: SVGElement | null) => el),
  isEditableTextMock: vi.fn(() => true),
}));

const clickHandlerMock = {
  _cb: undefined as ((e: MouseEvent) => void) | undefined,
  onDoubleClick: vi.fn(function (this: any, cb: (e: MouseEvent) => void) {
    (this as any)._cb = cb;
    return this;
  }),
  destroy: vi.fn(),
};

vi.mock('../../../../src/editor/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/editor/utils');
  return {
    ...actual,
    ClickHandler: vi.fn(() => clickHandlerMock),
    getEventTarget: (args: any) => getEventTargetMock(args),
  };
});

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return {
    ...actual,
    isEditableText: () => isEditableTextMock(),
    getTextContent: vi.fn(() => 'original'),
    getTextEntity: vi.fn((el: any) => el.querySelector('span')),
    injectStyleOnce: vi.fn(),
  };
});

vi.mock('../../../../src/editor/commands', () => {
  const UpdateTextCommand = vi.fn().mockImplementation(() => ({
    apply: vi.fn(),
    undo: vi.fn(),
    serialize: vi.fn(),
  }));
  return { UpdateTextCommand };
});

describe('DblClickEditText', () => {
  beforeEach(() => {
    clickHandlerMock._cb = undefined;
    vi.clearAllMocks();
    getEventTargetMock.mockImplementation((el: SVGElement | null) => el);
    isEditableTextMock.mockReturnValue(true);
  });

  const createEmitter = () => {
    const listeners = new Map<string, Set<any>>();
    const emitter = {
      on: vi.fn((event: string, handler: any) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(handler);
        return emitter;
      }),
      off: vi.fn((event: string, handler: any) => {
        listeners.get(event)?.delete(handler);
        return emitter;
      }),
      emit: vi.fn((event: string, payload: any) => {
        listeners.get(event)?.forEach((fn) => fn(payload));
        return emitter;
      }),
    };
    return emitter;
  };

  it('selects editable text and dispatches UpdateTextCommand on blur', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = createEmitter() as any;
    const select = vi.fn();
    const commander = { execute: vi.fn() };
    const interaction = {
      isActive: () => true,
      select,
      executeExclusiveInteraction: async (_: any, fn: any) => fn(),
    };

    const text = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    const span = document.createElement('span');
    span.textContent = 'original';
    text.appendChild(span);

    const instance = new DblClickEditText();
    instance.init({
      emitter,
      editor: { getDocument: () => svg } as any,
      commander: commander as any,
      state: {} as any,
      interaction: interaction as any,
    });

    const mockEvent = { target: text } as unknown as MouseEvent;
    clickHandlerMock._cb?.(mockEvent);
    span.dispatchEvent(new FocusEvent('blur'));
    await Promise.resolve();

    expect(select).toHaveBeenCalledWith([text], 'replace');
    const { UpdateTextCommand } = await import(
      '../../../../src/editor/commands'
    );
    expect(UpdateTextCommand).toHaveBeenCalledWith(
      text,
      'original',
      'original',
    );
    expect(commander.execute).toHaveBeenCalled();

    instance.destroy();
  });

  it('blurs and saves when selection changes during editing', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = createEmitter() as any;
    const select = vi.fn();
    const commander = { execute: vi.fn() };
    const interaction = {
      isActive: () => true,
      select,
      executeExclusiveInteraction: async (_: any, fn: any) => fn(),
    };

    const text = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    const span = document.createElement('span');
    span.textContent = 'original';
    span.blur = vi.fn(() => span.dispatchEvent(new FocusEvent('blur')));
    text.appendChild(span);

    const instance = new DblClickEditText();
    instance.init({
      emitter,
      editor: { getDocument: () => svg } as any,
      commander: commander as any,
      state: {} as any,
      interaction: interaction as any,
    });

    const mockEvent = {
      target: text,
      clientX: 4,
      clientY: 4,
    } as unknown as MouseEvent;
    clickHandlerMock._cb?.(mockEvent);

    span.textContent = 'updated';
    emitter.emit('selection:change', { prev: [text], next: [] });
    await Promise.resolve();

    expect(select).toHaveBeenCalledWith([text], 'replace');
    expect(span.blur).toHaveBeenCalled();
    const { UpdateTextCommand } = await import(
      '../../../../src/editor/commands'
    );
    expect(UpdateTextCommand).toHaveBeenCalledWith(text, 'updated', 'original');
    expect(commander.execute).toHaveBeenCalled();
    expect(emitter.off).toHaveBeenCalled();

    instance.destroy();
  });
});
