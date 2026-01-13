import { ParsedInfographicOptions } from '../../options';
import { loadResource, ResourceConfig } from '../../resource';
import type { DynamicAttributes } from '../../themes';
import type { IconAttributes, ItemDatum } from '../../types';
import { createIconElement, getAttributes } from '../../utils';
import { parseDynamicAttributes } from '../utils';

export function renderItemIcon(
  svg: SVGSVGElement,
  node: SVGElement,
  datum: ItemDatum,
  options: ParsedInfographicOptions,
) {
  const value = datum.icon;
  if (!value) return null;
  const { themeConfig } = options;
  const dataAttrs = datum.attributes?.icon as Record<string, any> | undefined;
  const attrs: DynamicAttributes<IconAttributes> = {
    ...themeConfig.item?.icon,
    ...dataAttrs,
  };

  const parsedAttrs = parseDynamicAttributes(node, attrs);
  return createIcon(svg, node, value, parsedAttrs, datum);
}

function createIcon(
  svg: SVGSVGElement,
  node: SVGElement,
  value: string | ResourceConfig,
  attrs: IconAttributes,
  datum?: ItemDatum,
) {
  // load async
  loadResource(svg, 'icon', value, datum);

  return createIconElement(value, {
    ...getAttributes(node, [
      'id',
      'x',
      'y',
      'width',
      'height',
      'fill',
      'stroke',
      'data-element-type',
      'data-indexes',
    ]),
    ...attrs,
  });
}
