import { getResourceHref, ResourceConfig } from '../resource';
import type { IconAttributes, IconElement } from '../types';
import { createElement, getAttributes, setAttributes } from './svg';

export function createIconElement(
  value: string | ResourceConfig,
  attrs: IconAttributes = {},
): IconElement {
  const icon = createElement<IconElement>('use', {
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

function applyIconColor(icon: IconElement) {
  const { stroke, fill } = getAttributes(icon, ['fill', 'stroke']);
  icon.style.color = fill || stroke || 'currentColor';
}
