import { describe, expect, it, vi } from 'vitest';
import { UpdateOptionsCommand } from '../../../../src/editor/commands/UpdateOptions';
import type { IStateManager } from '../../../../src/editor/types';

describe('UpdateOptionsCommand', () => {
  it('applies partial options and captures partial original for undo', async () => {
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
    });

    await command.undo(state);
    expect(state.updateOptions).toHaveBeenLastCalledWith({
      theme: 'light',
    });

    expect(command.serialize()).toEqual({
      type: 'update-options',
      options: { theme: 'dark' },
      original: { theme: 'light' },
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

  it('merges nested options deeply', async () => {
    const initialOptions = {
      design: {
        background: 'white',
        padding: 10,
      },
    } as any;

    const state: IStateManager = {
      getOptions: vi.fn().mockReturnValue(initialOptions),
      updateOptions: vi.fn(),
    } as any;

    const command = new UpdateOptionsCommand({
      design: { background: 'black' } as any, // Partial update
    });

    await command.apply(state);

    expect(state.updateOptions).toHaveBeenCalledWith({
      design: { background: 'black' },
    });
  });
});
