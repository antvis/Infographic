import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClickSelect } from '../../../../src/editor/interactions/click-select';

const { getEventTargetMock, isEditingTextMock } = vi.hoisted(() => ({
  getEventTargetMock: vi.fn((el: SVGElement | null) => el),
  isEditingTextMock: vi.fn(() => false),
}));

const clickHandlerMock = {
  _cb: undefined as ((e: MouseEvent) => void) | undefined,
  onClick: vi.fn(function (this: any, cb: (e: MouseEvent) => void) {
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
    isEditingText: () => isEditingTextMock(),
  };
});

describe('ClickSelect interaction', () => {
  beforeEach(() => {
    clickHandlerMock._cb = undefined;
    vi.clearAllMocks();
    getEventTargetMock.mockImplementation((el: SVGElement | null) => el);
    isEditingTextMock.mockReturnValue(false);
  });

  it('handles single and multi-selection based on shift state', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any;
    const interaction = {
      isActive: () => true,
      select: vi.fn(),
      isSelected: vi.fn(() => false),
      clearSelection: vi.fn(),
      executeExclusiveInteraction: async (_: any, fn: any) => fn(),
    };
    const state = {} as any;
    const instance = new ClickSelect();
    instance.init({
      emitter,
      editor: { getDocument: () => svg } as any,
      commander: {} as any,
      state,
      interaction: interaction as any,
    });

    const target = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    const mockEvent = { target } as unknown as MouseEvent;
    clickHandlerMock._cb?.(mockEvent);
    expect(interaction.select).toHaveBeenCalledWith([target], 'replace');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    clickHandlerMock._cb?.(mockEvent);
    expect(interaction.select).toHaveBeenCalledWith([target], 'add');

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
    clickHandlerMock._cb?.(mockEvent);
    expect(interaction.select).toHaveBeenCalledWith([target], 'replace');

    instance.destroy();
    expect(clickHandlerMock.destroy).toHaveBeenCalled();
  });

  it('skips editing text and clears selection on empty click or escape', async () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const emitter = { on: vi.fn(), off: vi.fn(), emit: vi.fn() } as any;
    const clearSelection = vi.fn();
    const interaction = {
      isActive: () => true,
      select: vi.fn(),
      isSelected: vi.fn(() => true),
      clearSelection,
      executeExclusiveInteraction: async (_: any, fn: any) => fn(),
    };
    const state = {} as any;
    const instance = new ClickSelect();
    instance.init({
      emitter,
      editor: { getDocument: () => svg } as any,
      commander: {} as any,
      state,
      interaction: interaction as any,
    });

    const target = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    const mockEvent = { target } as unknown as MouseEvent;

    isEditingTextMock.mockReturnValue(true);
    clickHandlerMock._cb?.(mockEvent);
    expect(interaction.select).not.toHaveBeenCalled();

    isEditingTextMock.mockReturnValue(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
    clickHandlerMock._cb?.(mockEvent);
    expect(interaction.select).toHaveBeenCalledWith([target], 'remove');

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
    clickHandlerMock._cb?.({ target: null } as unknown as MouseEvent);
    expect(clearSelection).toHaveBeenCalledTimes(1);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(clearSelection).toHaveBeenCalledTimes(2);

    instance.destroy();
  });
});
