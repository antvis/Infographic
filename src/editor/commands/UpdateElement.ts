import type { Element } from '../../types';
import {
  getAttributes,
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
    const modifiedAttrKeys = Object.keys(modified.attributes || {});
    const originalAttributes = getAttributes(element, modifiedAttrKeys, false);

    const assignModifiedAttributes = (attrs?: Record<string, any>) => {
      if (!attrs) return;
      modifiedAttrKeys.forEach((key) => {
        if (key in attrs) originalAttributes[key] = attrs[key];
      });
    };

    const original = {
      ...modified,
      attributes: originalAttributes,
    };

    if (isEditableText(element)) {
      const { attributes } = getTextElementProps(element);
      assignModifiedAttributes(attributes);
    } else if (isIconElement(element)) {
      const entity = getIconEntity(element);
      if (!entity) return;
      assignModifiedAttributes(getIconAttrs(element));
    }
    // TODO illus

    this.original = original;
  }

  async apply(state: IStateManager) {
    updateElement(this.element, this.modified);
    state.updateElement(this.element, this.modified);
  }

  async undo(state: IStateManager) {
    if (this.original) {
      updateElement(this.element, this.original);
      state.updateElement(this.element, this.original);
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
