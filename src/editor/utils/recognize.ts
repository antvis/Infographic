import { ElementTypeEnum } from '../../constants';
import type { TextElement } from '../../types';
import { getElementRole } from '../../utils';

export function isForeignObjectElement(
  element: any,
): element is SVGForeignObjectElement {
  return element.tagName === 'foreignObject';
}

export function isSpanElement(element: any): element is HTMLSpanElement {
  return element.tagName === 'SPAN';
}

export function isEditableText(node: SVGElement): node is TextElement {
  const role = getElementRole(node);
  return [
    ElementTypeEnum.Title,
    ElementTypeEnum.Desc,
    ElementTypeEnum.ItemLabel,
    ElementTypeEnum.ItemDesc,
  ].includes(role);
}

export function isEditingText(element: SVGElement | null): boolean {
  if (!element) return false;
  if (!isEditableText(element)) return false;

  const span = getTextSpan(element);
  if (!span) return false;
  return span.hasAttribute('contenteditable');
}

export function getTextSpan(text: SVGElement): HTMLSpanElement | null {
  if (!isForeignObjectElement(text)) return null;
  return text.querySelector('span');
}
