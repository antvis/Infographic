import type { TextElement } from '../../types';
import type { Command } from '../types';
import { getTextContent } from '../utils';

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

  async apply() {
    console.log('Apply UpdateTextCommand', this.modifiedText);
    // Todo update data by editor api
  }

  async undo() {
    // Todo update data by editor api
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
