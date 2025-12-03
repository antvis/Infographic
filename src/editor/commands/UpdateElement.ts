import type { Element } from '../../types';
import {
  getAttributes,
  getIconResourceConfig,
  getTextElementProps,
  isEditableText,
  isIconElement,
  updateTextElement,
} from '../../utils';
import type { Command, ElementProps, IStateManager, TextProps } from '../types';
import { getIconAttrs, getIconEntity } from '../utils';

export class UpdateElementCommand implements Command {
  private original?: Partial<ElementProps>;

  constructor(
    private element: Element,
    private modified: Partial<ElementProps>,
  ) {
    const original = {
      ...modified,
      attributes: getAttributes(
        element,
        Object.keys(modified.attributes || {}),
        false,
      ),
    };

    if (isEditableText(element)) {
      const { textContent, attributes } = getTextElementProps(element);
      if (textContent !== undefined) Object.assign(original, { textContent });
      if (attributes) Object.assign(original.attributes, attributes);
    } else if (isIconElement(element)) {
      const entity = getIconEntity(element);
      if (!entity) return;
      Object.assign(original.attributes, {
        config: getIconResourceConfig(entity),
      });
      Object.assign(original.attributes, getIconAttrs(element));
    }
    // TODO illus

    this.original = original;
  }

  async apply(state: IStateManager) {
    updateElement(this.element, this.modified);
    state.updateBuiltInElement(this.element, this.modified);
  }

  async undo(state: IStateManager) {
    if (this.original) {
      updateElement(this.element, this.original);
      state.updateBuiltInElement(this.element, this.original);
    }
  }

  serialize() {
    return {
      type: 'update-element',
      elementId: this.element.id,
      modified: this.modified,
      original: this.original,
    };
  }
}

function updateElement(element: Element, props: Partial<ElementProps>) {
  if (isEditableText(element)) {
    updateTextElement(element, props as TextProps);
  }
}
