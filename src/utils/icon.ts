import { getResourceHref, ResourceConfig } from '../resource';
import type { IconAttributes, IconElement } from '../types';
import { createElement, getAttributes } from './svg';

const ICON_RESOURCE_CACHE = new WeakMap<IconElement, string | ResourceConfig>();

export function getIconResourceConfig(
  icon: IconElement,
): string | ResourceConfig | null {
  return ICON_RESOURCE_CACHE.get(icon) || null;
}

export function createIconElement(
  value: string | ResourceConfig,
  attrs: IconAttributes = {},
): IconElement {
  const icon = createElement<IconElement>('use', {
    ...attrs,
    href: getResourceHref(value),
  });

  applyIconColor(icon);

  ICON_RESOURCE_CACHE.set(icon, value);

  return icon;
}

export function applyIconColor(icon: IconElement) {
  const { stroke, fill } = getAttributes(icon, ['fill', 'stroke']);
  icon.style.color = fill || stroke || 'currentColor';
}
