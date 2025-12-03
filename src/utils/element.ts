import { ElementTypeEnum } from '../constants';
import { isIconElement } from './recognizer';

export function setElementRole(
  element: SVGElement | HTMLElement,
  role: string,
) {
  element.setAttribute('data-element-type', role);
}

export function getElementByRole(
  element: SVGElement | HTMLElement,
  role: string,
) {
  return element.querySelector(`[data-element-type="${role}"]`);
}

export function getElementRole(
  element: SVGElement | HTMLElement,
): ElementTypeEnum {
  if (isIconElement(element as any)) return ElementTypeEnum.ItemIcon;
  return (
    (element.getAttribute('data-element-type') as ElementTypeEnum) ||
    ElementTypeEnum.Unknown
  );
}
