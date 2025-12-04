import { getResourceHref, ResourceConfig } from '../resource';
import type { IconAttributes, IconElement } from '../types';
import { createElement, getAttributes, setAttributes } from './svg';

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

export function getIconEntity(icon: IconElement): SVGUseElement | null {
  if (icon.tagName === 'use') {
    return icon as SVGUseElement;
  }
  return icon.querySelector('use');
}

export function getIconAttrs(icon: IconElement): IconAttributes {
  const entity = getIconEntity(icon);
  if (!entity) return {};
  const attrs = getAttributes(entity, [
    'width',
    'height',
    'x',
    'y',
    'width',
    'height',
    'fill',
    'fill-opacity',
    'stroke',
    'opacity',
  ]);

  return attrs;
}

export function updateIconElement(
  icon: IconElement,
  value?: string | ResourceConfig,
  attrs?: IconAttributes,
): void {
  const entity = getIconEntity(icon);
  if (!entity) return;

  if (value) setAttributes(entity, { href: getResourceHref(value) });
  if (attrs) setAttributes(entity, attrs);
  applyIconColor(entity);
}
