import { describe, expect, it, vi } from 'vitest';
import { UpdateOptionsCommand } from '../../../../src/editor/commands/UpdateOptions';
import type { IStateManager } from '../../../../src/editor/types';

describe('UpdateOptionsCommand', () => {
  it('merges options and captures original for undo', async () => {
    const state: IStateManager = {
      getOptions: vi
        .fn()
        .mockReturnValue({ theme: 'light', padding: 0 } as any),
      updateOptions: vi.fn(),
    } as any;

    const command = new UpdateOptionsCommand({ theme: 'dark' });

    await command.apply(state);
    expect(state.getOptions).toHaveBeenCalled();
    expect(state.updateOptions).toHaveBeenCalledWith({
      theme: 'dark',
      padding: 0,
    });

    await command.undo(state);
    expect(state.updateOptions).toHaveBeenLastCalledWith({
      theme: 'light',
      padding: 0,
    });

    expect(command.serialize()).toEqual({
      type: 'update-options',
      options: { theme: 'dark' },
      original: { theme: 'light', padding: 0 },
    });
  });

  it('respects provided original options', async () => {
    const providedOriginal = { theme: 'provided', padding: 8 } as any;
    const state: IStateManager = {
      getOptions: vi
        .fn()
        .mockReturnValue({ theme: 'light', padding: 4 } as any),
      updateOptions: vi.fn(),
    } as any;

    const command = new UpdateOptionsCommand(
      { theme: 'dark', padding: 12 },
      providedOriginal,
    );

    await command.apply(state);
    expect(state.updateOptions).toHaveBeenCalledWith({
      theme: 'dark',
      padding: 12,
    });

    await command.undo(state);
    expect(state.updateOptions).toHaveBeenLastCalledWith(providedOriginal);
    expect(command.serialize().original).toBe(providedOriginal);
  });
});
