import { getResourceHref, ResourceConfig } from '../../resource';
import type { IconAttributes, IconElement } from '../../types';
import { applyIconColor, getAttributes, setAttributes } from '../../utils';

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
