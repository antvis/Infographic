import { describe, expect, it, vi } from 'vitest';
import { ICommand } from '../../../../src/editor';
import { CommandManager } from '../../../../src/editor/managers/command';

const createCommand = (label: string, order: string[] = []) =>
  ({
    apply: vi.fn(async () => {
      order.push(`apply-${label}`);
    }),
    undo: vi.fn(async () => {
      order.push(`undo-${label}`);
    }),
    serialize: vi.fn(() => ({ type: label })),
  }) as ICommand;

describe('CommandManager', () => {
  it('executes commands and manages undo/redo stacks', () => {
    const state = {} as any;
    const commandManager = new CommandManager();
    const order: string[] = [];
    const command = createCommand('one', order);

    commandManager.init({ state });
    commandManager.execute(command);

    expect(command.apply).toHaveBeenCalledWith(state);
    expect(commandManager.canUndo()).toBe(true);
    expect(commandManager.canRedo()).toBe(false);

    commandManager.undo();
    expect(command.undo).toHaveBeenCalledWith(state);
    expect(commandManager.canRedo()).toBe(true);

    commandManager.redo();
    expect(command.apply).toHaveBeenCalledTimes(2);
    expect(order).toEqual(['apply-one', 'undo-one', 'apply-one']);
    expect(commandManager.canRedo()).toBe(false);
  });

  it('executes batch commands in order and undoes them in reverse', async () => {
    const state = {} as any;
    const order: string[] = [];
    const commandA = createCommand('a', order);
    const commandB = createCommand('b', order);
    const commandManager = new CommandManager();

    commandManager.init({ state });
    commandManager.executeBatch([commandA, commandB]);
    await Promise.resolve();

    expect(order).toEqual(['apply-a', 'apply-b']);

    const serializedBeforeUndo = commandManager.serialize();
    expect(serializedBeforeUndo).toEqual([
      { type: 'batch', commands: [{ type: 'a' }, { type: 'b' }] },
    ]);

    commandManager.undo();
    await Promise.resolve();
    expect(order).toEqual(['apply-a', 'apply-b', 'undo-b', 'undo-a']);
    expect(commandManager.serialize()).toEqual([]);
    expect(commandA.serialize).toHaveBeenCalled();
    expect(commandB.serialize).toHaveBeenCalled();
  });
});
