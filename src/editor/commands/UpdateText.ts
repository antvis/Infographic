import type { TextElement } from '../../types';
import { getElementRole, getTextContent, setTextContent } from '../../utils';
import type { ICommand, IStateManager } from '../types';
import { getIndexesFromElement } from '../utils';

export class UpdateTextCommand implements ICommand {
  private originalText: string;
  private modifiedText: string;

  constructor(
    private element: TextElement,
    newText: string,
    originalText?: string,
  ) {
    this.originalText = originalText ?? getTextContent(element);
    this.modifiedText = newText;
  }

  async apply(state: IStateManager) {
    if (this.originalText === this.modifiedText) return;
    setTextContent(this.element, this.modifiedText);
    updateItemText(state, this.element, this.modifiedText);
  }

  async undo(state: IStateManager) {
    if (this.originalText === this.modifiedText) return;
    setTextContent(this.element, this.originalText);
    updateItemText(state, this.element, this.originalText);
  }

  serialize() {
    return {
      type: 'update-text',
      elementId: this.element.id,
      original: this.originalText,
      modified: this.modifiedText,
    };
  }
}

function updateItemText(
  state: IStateManager,
  element: TextElement,
  text: string,
) {
  const role = getElementRole(element);
  if (role.startsWith('item-')) {
    const key = role.replace('item-', '');
    const indexes = getIndexesFromElement(element);
    state.updateItemDatum(indexes, { [key]: text });
  } else {
    state.updateData(role, text);
  }
}
