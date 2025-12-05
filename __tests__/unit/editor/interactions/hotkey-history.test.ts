import { describe, expect, it, vi } from 'vitest';
import { HotkeyHistory } from '../../../../src/editor/interactions/hotkey-history';

const hotkeyBindMock = vi.fn();
const hotkeyDestroyMock = vi.fn();
const hotkeyFilterMock = vi.fn();

vi.mock('../../../../src/editor/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/editor/utils');
  return {
    ...actual,
    Hotkey: vi.fn((options: any) => {
      hotkeyFilterMock.mockImplementation(() =>
        options.filter ? options.filter({} as KeyboardEvent) : true,
      );
      return {
        bind: (combo: string | string[], handler: any) => {
          hotkeyBindMock(combo, handler);
          return () => {};
        },
        destroy: hotkeyDestroyMock,
      };
    }),
  };
});

describe('HotkeyHistory interaction', () => {
  it('binds undo/redo hotkeys and delegates to commander', async () => {
    const commander = { undo: vi.fn(), redo: vi.fn() };
    const interaction = { isActive: () => true } as any;

    const instance = new HotkeyHistory();
    instance.init({
      emitter: {} as any,
      editor: {} as any,
      commander: commander as any,
      interaction,
      state: {} as any,
    });

    const bindings = hotkeyBindMock.mock.calls.map(([combo, handler]) => ({
      combo,
      handler,
    }));
    expect(bindings.find((b) => b.combo === 'mod+z')).toBeTruthy();
    const redoBinding = bindings.find(
      (b) => Array.isArray(b.combo) && (b.combo as string[]).includes('mod+y'),
    );
    expect(redoBinding).toBeTruthy();

    const undoEvent = new KeyboardEvent('keydown', { key: 'z' });
    const undoPrevent = vi.spyOn(undoEvent, 'preventDefault');
    bindings.find((b) => b.combo === 'mod+z')?.handler(undoEvent);
    expect(undoPrevent).toHaveBeenCalled();
    expect(commander.undo).toHaveBeenCalled();

    const redoEvent = new KeyboardEvent('keydown', { key: 'y' });
    const redoPrevent = vi.spyOn(redoEvent, 'preventDefault');
    redoBinding?.handler(redoEvent);
    expect(redoPrevent).toHaveBeenCalled();
    expect(commander.redo).toHaveBeenCalled();

    instance.destroy();
    expect(hotkeyDestroyMock).toHaveBeenCalled();
  });
});
