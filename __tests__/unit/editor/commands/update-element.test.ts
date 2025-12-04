import { describe, expect, it, vi } from 'vitest';
import { UpdateElementCommand } from '../../../../src/editor/commands/UpdateElement';
import type { IStateManager } from '../../../../src/editor/types';

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return {
    ...actual,
    isEditableText: vi.fn(() => true),
    isIconElement: vi.fn(() => false),
    updateTextElement: vi.fn(),
    updateIconElement: vi.fn(),
    getAttributes: vi.fn(() => ({ fill: 'blue' })),
    getTextElementProps: vi.fn(() => ({ attributes: { fill: 'blue' } })),
    getIconEntity: vi.fn(() => ({})),
    getIconAttrs: vi.fn(() => ({})),
  };
});

describe('UpdateElementCommand', () => {
  it('applies modified props and undoes to original props', async () => {
    const { updateTextElement } = await import('../../../../src/utils');
    const state: IStateManager = {
      updateElement: vi.fn(),
    } as any;
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    ) as any;

    const command = new UpdateElementCommand(
      element,
      { attributes: { fill: 'red' } },
      { attributes: { fill: 'blue' } },
    );

    await command.apply(state);
    expect(updateTextElement).toHaveBeenCalledWith(element, {
      attributes: { fill: 'red' },
    });
    expect(state.updateElement).toHaveBeenCalledWith(element, {
      attributes: { fill: 'red' },
    });

    await command.undo(state);
    expect(updateTextElement).toHaveBeenLastCalledWith(element, {
      attributes: { fill: 'blue' },
    });
    expect(state.updateElement).toHaveBeenLastCalledWith(element, {
      attributes: { fill: 'blue' },
    });

    expect(command.serialize()).toMatchObject({
      type: 'update-element',
      modified: { attributes: { fill: 'red' } },
      original: { attributes: { fill: 'blue' } },
    });
  });
});
