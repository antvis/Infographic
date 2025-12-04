import { describe, expect, it, vi } from 'vitest';
import { BatchCommand } from '../../../../src/editor/commands/Batch';
import type { IStateManager } from '../../../../src/editor/types';

describe('BatchCommand', () => {
  it('applies commands sequentially and undoes in reverse order', async () => {
    const state = {} as IStateManager;
    const events: string[] = [];
    const makeCommand = (label: string) => ({
      apply: vi.fn(async () => events.push(`apply-${label}`)),
      undo: vi.fn(async () => events.push(`undo-${label}`)),
      serialize: vi.fn(() => ({ type: label })),
    });

    const a = makeCommand('a');
    const b = makeCommand('b');
    const batch = new BatchCommand([a as any, b as any]);

    await batch.apply(state);
    expect(events).toEqual(['apply-a', 'apply-b']);

    await batch.undo(state);
    expect(events).toEqual(['apply-a', 'apply-b', 'undo-b', 'undo-a']);
    expect(batch.serialize()).toEqual({
      type: 'batch',
      commands: [{ type: 'a' }, { type: 'b' }],
    });
  });
});
