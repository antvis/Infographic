import { ElementTypeEnum } from '../constants';

export function getElementByRole(element: SVGElement, role: string) {
  return element.querySelector(`[data-element-type="${role}"]`);
}

export function getElementRole(element: SVGElement): ElementTypeEnum {
  return (
    (element.getAttribute('data-element-type') as ElementTypeEnum) ||
    ElementTypeEnum.Unknown
  );
}
