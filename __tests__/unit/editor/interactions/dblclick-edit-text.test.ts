import { describe, expect, it, vi } from 'vitest';
import { DblClickEditText } from '../../../../src/editor/interactions/dblclick-edit-text';

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
    getEventTarget: vi.fn((el: SVGElement | null) => el),
  };
});

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return {
    ...actual,
    isEditableText: vi.fn(() => true),
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
  it('selects editable text and dispatches UpdateTextCommand on blur', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any;
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
});
