import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UpdateTextCommand } from '../../../../src/editor/commands/UpdateText';
import type { IStateManager } from '../../../../src/editor/types';
import { TextElement } from '../../../../src/types';

const createTextElement = (
  role: string,
  text: string,
  indexes?: number[],
): { element: TextElement; span: HTMLSpanElement } => {
  const foreignObject = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'foreignObject',
  ) as unknown as TextElement;
  const span = document.createElement('span');
  span.innerText = text;
  foreignObject.appendChild(span);
  foreignObject.setAttribute('data-element-type', role);
  if (indexes) {
    foreignObject.setAttribute('data-indexes', indexes.join(','));
  }
  foreignObject.id = `${role}-id`;
  return { element: foreignObject, span };
};

describe('UpdateTextCommand', () => {
  let state: IStateManager;

  beforeEach(() => {
    state = {
      updateItemDatum: vi.fn(),
      updateData: vi.fn(),
    } as unknown as IStateManager;
  });

  it('updates item text and restores it on undo', async () => {
    const { element, span } = createTextElement('item-label', 'before', [1, 0]);
    const command = new UpdateTextCommand(element, 'after');

    await command.apply(state);
    expect(span.innerText).toBe('after');
    expect(state.updateItemDatum).toHaveBeenCalledWith([1, 0], {
      label: 'after',
    });

    await command.undo(state);
    expect(span.innerText).toBe('before');
    expect(state.updateItemDatum).toHaveBeenLastCalledWith([1, 0], {
      label: 'before',
    });
  });

  it('updates top-level data for non-item text roles', async () => {
    const { element, span } = createTextElement('title', 'Old title');
    const command = new UpdateTextCommand(element, 'New title');

    await command.apply(state);
    expect(span.innerText).toBe('New title');
    expect(state.updateData).toHaveBeenCalledWith('title', 'New title');
    expect(state.updateItemDatum).not.toHaveBeenCalled();

    await command.undo(state);
    expect(span.innerText).toBe('Old title');
    expect(state.updateData).toHaveBeenLastCalledWith('title', 'Old title');
  });

  it('serializes the mutation with element id and text snapshots', () => {
    const { element } = createTextElement('title', 'before');
    element.id = 'text-1';

    const command = new UpdateTextCommand(element, 'after', 'before');
    expect(command.serialize()).toEqual({
      type: 'update-text',
      elementId: 'text-1',
      original: 'before',
      modified: 'after',
    });
  });
});
