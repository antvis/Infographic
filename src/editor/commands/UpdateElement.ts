import type { Element, IconElement } from '../../types';
import {
  getAttributes,
  getIconAttrs,
  getIconEntity,
  getTextElementProps,
  isEditableText,
  isIconElement,
  setAttributes,
  updateIconElement,
  updateTextElement,
} from '../../utils';
import type {
  ElementProps,
  ICommand,
  IStateManager,
  TextProps,
} from '../types';

export class UpdateElementCommand implements ICommand {
  private original?: Partial<ElementProps>;

  constructor(
    private element: Element,
    private modified: Partial<ElementProps>,
    original?: Partial<ElementProps>,
  ) {
    const computedOriginal = getOriginalProps(element, modified);
    this.original = mergeOriginalProps(computedOriginal, original);
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
  } else if (isIconElement(element)) {
    updateIconElement(element as IconElement, undefined, props.attributes);
  } else if (props.attributes) {
    setAttributes(element, props.attributes);
  }
}

function getOriginalProps(
  element: Element,
  modified: Partial<ElementProps>,
): Partial<ElementProps> | undefined {
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

  return original;
}

function mergeOriginalProps(
  computed: Partial<ElementProps> | undefined,
  provided: Partial<ElementProps> | undefined,
): Partial<ElementProps> | undefined {
  if (!computed) return provided;
  if (!provided) return computed;

  const mergedAttributes = {
    ...(computed.attributes || {}),
    ...(provided.attributes || {}),
  };

  return {
    ...computed,
    ...provided,
    attributes: Object.keys(mergedAttributes).length
      ? mergedAttributes
      : undefined,
  };
}
