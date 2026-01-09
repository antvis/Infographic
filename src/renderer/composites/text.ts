import { get, kebabCase } from 'lodash-es';
import { ParsedInfographicOptions } from '../../options';
import type { DynamicAttributes } from '../../themes';
import type { ItemDatum, TextAttributes } from '../../types';
import {
  createTextElement,
  encodeFontFamily,
  getAttributes,
  getDatumByIndexes,
  getItemIndexes,
  setAttributes,
} from '../../utils';
import { parseDynamicAttributes } from '../utils';

export function renderText(
  node: SVGElement,
  text: string,
  attrs: DynamicAttributes<TextAttributes> = {},
) {
  if (!text) return null;

  const textElement = node as SVGTextElement;

  const staticAttrs = parseDynamicAttributes(textElement, attrs);

  setAttributes(textElement, staticAttrs);

  const renderedText = layoutText(text, textElement);

  for (const key in textElement.dataset) {
    renderedText.setAttribute(
      `data-${kebabCase(key)}`,
      textElement.dataset[key]!,
    );
  }

  return renderedText;
}

export function renderItemText(
  type: 'label' | 'desc' | 'value',
  node: SVGElement,
  options: ParsedInfographicOptions,
) {
  const textShape = node.nodeName === 'text' ? node : null;

  if (!textShape) return null;
  const { data, themeConfig } = options;
  const indexes = getItemIndexes(node.dataset.indexes || '0');
  const datum = getDatumByIndexes(data, indexes) as ItemDatum | undefined;
  const text = String(get(datum, type, ''));
  const dataAttrs = datum?.attributes?.[type] as
    | Record<string, any>
    | undefined;
  const attrs = Object.assign(
    {},
    themeConfig.base?.text,
    themeConfig.item?.[type],
    dataAttrs,
  );

  const staticAttrs = parseDynamicAttributes(textShape, attrs);
  return renderText(node, node.textContent || text, staticAttrs);
}

export function renderStaticText(
  text: SVGTextElement,
  options: ParsedInfographicOptions,
) {
  const attrs = options.themeConfig.base?.text || {};
  setAttributes(text, attrs);
  if (attrs['font-family']) {
    text.setAttribute('font-family', encodeFontFamily(attrs['font-family']));
  }
  text.style.userSelect = 'none';
  text.style.pointerEvents = 'none';
}

const norm = (value: any, defaultValue?: number) => {
  if (!value) return defaultValue;
  return parseFloat(value);
};

function layoutText(textContent: string, text: SVGTextElement): SVGElement {
  const x = norm(text.dataset.x, 0);
  const y = norm(text.dataset.y, 0);
  const width = norm(text.getAttribute('width'));
  const height = norm(text.getAttribute('height'));

  const attributes = getTextAttributes(text);
  Object.assign(attributes, {
    x,
    y,
    width,
    height,
    'data-horizontal-align': text.dataset.horizontalAlign || 'LEFT',
    'data-vertical-align': text.dataset.verticalAlign || 'TOP',
  });

  const element = createTextElement(textContent, attributes as any);
  return element;
}

function getTextAttributes(textElement: SVGTextElement) {
  const attrs: Record<string, any> = getAttributes(textElement, [
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'font-variant',
    'letter-spacing',
    'line-height',
    'fill',
    'stroke',
    'stroke-width',
  ]);

  return attrs;
}
