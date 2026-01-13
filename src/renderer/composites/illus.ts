import {
  getResourceHref,
  getResourceId,
  loadResource,
  parseResourceConfig,
  type ResourceConfig,
} from '../../resource';
import type { IllusAttributes, IllusElement, ItemDatum } from '../../types';
import {
  createElement,
  getAttributes,
  getOrCreateDefs,
  removeAttributes,
  setAttributes,
  uuid,
} from '../../utils';
import { ElementTypeEnum } from '../constants';

type IllusRenderAttributes = IllusAttributes & Record<string, any>;

export function renderIllus(
  svg: SVGSVGElement,
  node: SVGElement,
  value: string | ResourceConfig | undefined,
  datum?: ItemDatum,
  attrs: Record<string, any> = {},
): IllusElement | null {
  if (!value) return null;
  const config = parseResourceConfig(value);
  if (!config) return null;

  const id = getResourceId(config)!;
  if (attrs && Object.keys(attrs).length > 0) {
    setAttributes(node, attrs);
  }
  const clipPathId = createClipPath(svg, node, id);

  loadResource(svg, 'illus', config, datum);

  const { data, color } = config;
  return createIllusElement(
    id,
    {
      ...parseIllusBounds(node),
      ...(color ? { color } : {}),
      ...attrs,
      'clip-path': `url(#${clipPathId})`,
    },
    data,
  );
}

export function renderItemIllus(
  svg: SVGSVGElement,
  node: SVGElement,
  datum: ItemDatum,
) {
  const value = datum.illus;
  const attrs = datum.attributes?.illus as Record<string, any> | undefined;
  return renderIllus(svg, node, value, datum, attrs);
}

function createClipPath(
  svg: SVGSVGElement,
  node: SVGElement,
  id: string,
): string {
  const clipPathId = `clip-${id}-${uuid()}`;

  if (svg.querySelector(`#${clipPathId}`)) {
    return clipPathId;
  }

  const defs = getOrCreateDefs(svg);
  const clipPath = createElement('clipPath', {
    id: clipPathId,
  });

  const clonedNode = node.cloneNode() as SVGElement;
  removeAttributes(clonedNode, [
    'id',
    'data-illus-bounds',
    'data-element-type',
  ]);

  clipPath.appendChild(clonedNode);
  defs.appendChild(clipPath);
  return clipPathId;
}

function createIllusElement(
  id: string,
  attrs: IllusRenderAttributes,
  value: string,
) {
  const { 'clip-path': clipPath, ...restAttrs } = attrs;

  const { x = '0', y = '0', width = '0', height = '0' } = restAttrs;
  const bounds = createElement<SVGRectElement>('rect', {
    id: `${id}-volume`,
    'data-element-type': ElementTypeEnum.IllusVolume,
    x,
    y,
    width,
    height,
    fill: 'transparent',
  });

  const g = createElement<IllusElement>('g', {
    'data-element-type': ElementTypeEnum.IllusGroup,
    'clip-path': clipPath,
    id: `${id}-group`,
  });

  g.appendChild(bounds);

  const use = createElement<SVGUseElement>('use', {
    id,
    fill: 'lightgray',
    ...restAttrs,
    href: getResourceHref(value),
    'data-element-type': ElementTypeEnum.Illus,
  });
  g.appendChild(use);

  return g;
}

function parseIllusBounds(node: SVGElement) {
  const dataIllusBounds = node.getAttribute('data-illus-bounds');
  if (!dataIllusBounds) {
    return {
      x: '0',
      y: '0',
      width: '0',
      height: '0',
      ...getAttributes(node, ['x', 'y', 'width', 'height']),
    };
  }
  const [x, y, width, height] = dataIllusBounds.split(' ');
  return { x, y, width, height };
}
