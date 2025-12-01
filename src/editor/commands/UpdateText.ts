import type { TextElement } from '../../types';
import { getElementRole } from '../../utils';
import type { Command, IStateManager } from '../types';
import { getIndexesFromElement, getTextContent } from '../utils';

export class UpdateTextCommand implements Command {
  private originalText: string;
  private modifiedText: string;

  constructor(
    private element: TextElement,
    newText: string,
  ) {
    this.originalText = getTextContent(element);
    this.modifiedText = newText;
  }

  async apply(state: IStateManager) {
    updateItemText(state, this.element, this.modifiedText);
  }

  async undo(state: IStateManager) {
    updateItemText(state, this.element, this.originalText);
  }

  serialize() {
    return {
      type: 'update-text',
      elementId: this.element.id,
      originalText: this.originalText,
      modifiedText: this.modifiedText,
    };
  }
}

function updateItemText(
  state: IStateManager,
  element: TextElement,
  text: string,
) {
  const role = getElementRole(element);
  if (!role.startsWith('item-')) return;
  const key = role.replace('item-', '');
  const indexes = getIndexesFromElement(element);
  state.updateItemDatum(indexes, { [key]: text });
}
