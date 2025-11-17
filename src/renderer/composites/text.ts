import { get, kebabCase } from 'lodash-es';
import { ParsedInfographicOptions } from '../../options';
import type { DynamicAttributes } from '../../themes';
import type { TextAttributes } from '../../types';
import {
  createTextElement,
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

  renderedText.setAttribute('id', node.getAttribute('id')!);
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
  const text = String(get(getDatumByIndexes(data, indexes), type, ''));
  const attrs = Object.assign(
    {},
    themeConfig.base?.text,
    themeConfig.item?.[type],
  );

  const staticAttrs = parseDynamicAttributes(textShape, attrs);
  return renderText(node, node.textContent || text, staticAttrs);
}

export function renderStaticText(
  text: SVGTextElement,
  options: ParsedInfographicOptions,
) {
  setAttributes(text, options.themeConfig.base?.text || {});
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
    'text-alignment': text.dataset.textAlignment || 'LEFT TOP',
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
