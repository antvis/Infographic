import { ParsedInfographicOptions } from '../../options';
import { loadResource, ResourceConfig } from '../../resource';
import type { DynamicAttributes, DynamicItemAttribute } from '../../themes';
import type { IconAttributes, IconElement } from '../../types';
import { createIconElement, getAttributes } from '../../utils';
import { parseDynamicAttributes } from '../utils';

export function renderIcon(
  svg: SVGSVGElement,
  node: SVGElement,
  value: string | ResourceConfig | undefined,
  attrs: DynamicAttributes<IconAttributes> = {},
): IconElement | null {
  if (!value) return null;
  const parsedAttrs = parseDynamicAttributes(node, attrs);

  return createIcon(svg, node, value, parsedAttrs);
}

export function renderItemIcon(
  svg: SVGSVGElement,
  node: SVGElement,
  value: string | ResourceConfig | undefined,
  options: ParsedInfographicOptions,
) {
  if (!value) return null;
  const { themeConfig } = options;
  const attrs: DynamicItemAttribute<IconAttributes> = {
    ...themeConfig.item?.icon,
  };

  const parsedAttrs = parseDynamicAttributes(node, attrs);
  return createIcon(svg, node, value, parsedAttrs);
}

function createIcon(
  svg: SVGSVGElement,
  node: SVGElement,
  value: string | ResourceConfig,
  attrs: IconAttributes,
) {
  // load async
  loadResource(svg, value);

  return createIconElement(value, {
    ...getAttributes(node, [
      'id',
      'x',
      'y',
      'width',
      'height',
      'fill',
      'stroke',
    ]),
    ...attrs,
  });
}
