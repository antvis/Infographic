import { ElementTypeEnum } from '../constants';
import { getResourceHref, ResourceConfig } from '../resource';
import type { IconAttributes, IconElement } from '../types';
import { createElement, getAttributes, setAttributes } from './svg';

export function createIconElement(
  value: string | ResourceConfig,
  attrs: IconAttributes = {},
): IconElement {
  const icon = createElement<IconElement>('use', {
    'data-element-type': ElementTypeEnum.Icon,
    ...attrs,
    href: getResourceHref(value),
  });

  applyIconColor(icon);

  return icon;
}

export function updateIconElement(
  icon: IconElement,
  name?: string,
  attrs?: IconAttributes,
): void {
  if (name) setAttributes(icon, { href: getResourceHref(name) });
  if (attrs) setAttributes(icon, attrs);
  applyIconColor(icon);
}

export function getIconElement(element: SVGElement): IconElement | null {
  if (!isIconElement(element)) return null;
  if (element.tagName === 'use') {
    return element as IconElement;
  }
  return element.querySelector<IconElement>(
    `use[data-element-type="${ElementTypeEnum.Icon}"]`,
  );
}

export function isIconElement(element: SVGElement): element is IconElement {
  return (
    element?.getAttribute('data-element-type') === ElementTypeEnum.Icon ||
    element?.getAttribute('data-element-type') === ElementTypeEnum.IconGroup
  );
}

function applyIconColor(icon: IconElement) {
  const { stroke, fill } = getAttributes(icon, ['fill', 'stroke']);
  icon.style.color = fill || stroke || 'currentColor';
}
