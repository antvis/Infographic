import { camelCase } from 'lodash-es';
import { TextProps } from '../editor';
import type {
  TextAttributes,
  TextElement,
  TextHorizontalAlign,
  TextVerticalAlign,
} from '../types';
import { decodeFontFamily, encodeFontFamily } from './font';
import { measureText } from './measure-text';
import { isForeignObjectElement } from './recognizer';
import { createElement, setAttributes } from './svg';

export function getTextEntity(text: SVGElement): HTMLSpanElement | null {
  if (!isForeignObjectElement(text)) return null;
  return text.querySelector('span');
}

export function createTextElement(
  textContent: string,
  attributes: TextAttributes,
): TextElement {
  const entity = document.createElement('span');
  // Set xmlns on the span element (HTML content)
  entity.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  const foreignObject = createElement<SVGForeignObjectElement>(
    'foreignObject',
    { overflow: 'visible' },
  );
  foreignObject.appendChild(entity);
  updateTextElement(foreignObject, { textContent, attributes });
  return foreignObject;
}

export function updateTextElement(
  text: TextElement,
  props: Partial<TextProps>,
) {
  const { textContent, attributes } = props;
  if (textContent !== undefined) {
    setTextContent(text, textContent);
  }
  if (!attributes) return;

  const entity = getTextEntity(text);
  let { width, height } = attributes;

  const textAttrs: TextAttributes = {};

  if (entity) {
    Object.assign(entity.style, getTextStyle(attributes));
    if (!width || !height) {
      const content = textContent ?? getTextContent(text);
      const { fontFamily, fontSize, fontWeight, lineHeight } = entity.style;
      const fSize = fontSize ? parseFloat(String(fontSize)) : 12;
      const rect = measureText(content, {
        fontFamily,
        fontSize: fSize,
        fontWeight,
        lineHeight: lineHeight.endsWith('px')
          ? parseFloat(lineHeight)
          : (parseFloat(lineHeight) || 1.4) * fSize,
      });

      if (!width && !text.hasAttribute('width')) width = String(rect.width);
      if (!height && !text.hasAttribute('height')) height = String(rect.height);
    }

    // 以下属性需要完成包围盒测量后再设置
    const {
      'data-horizontal-align': horizontal,
      'data-vertical-align': vertical,
    } = attributes;
    Object.assign(entity.style, alignToFlex(horizontal, vertical));
  }

  const { id, x, y } = attributes;
  if (id) textAttrs.id = id;
  if (x !== undefined) textAttrs.x = String(x);
  if (y !== undefined) textAttrs.y = String(y);
  if (width !== undefined) textAttrs.width = String(width);
  if (height !== undefined) textAttrs.height = String(height);
  setAttributes(text, textAttrs);
}

function alignToFlex(
  horizontal: string | undefined,
  vertical: string | undefined,
) {
  const style: Record<string, any> = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  };
  switch (horizontal) {
    case 'LEFT':
      style.textAlign = 'left';
      style.justifyContent = 'flex-start';
      break;
    case 'CENTER':
      style.textAlign = 'center';
      style.justifyContent = 'center';
      break;
    case 'RIGHT':
      style.textAlign = 'right';
      style.justifyContent = 'flex-end';
      break;
  }

  switch (vertical) {
    case 'TOP':
      style.alignContent = 'flex-start';
      style.alignItems = 'flex-start';
      break;
    case 'MIDDLE':
      style.alignContent = 'center';
      style.alignItems = 'center';
      break;
    case 'BOTTOM':
      style.alignContent = 'flex-end';
      style.alignItems = 'flex-end';
      break;
  }

  return style;
}

export function getTextStyle(attributes: TextAttributes) {
  const {
    x,
    y,
    width,
    height,
    ['data-horizontal-align']: horizontalAlign, // omit
    ['data-vertical-align']: verticalAlign, // omit
    ['font-size']: fontSize,
    ['letter-spacing']: letterSpacing,
    ['line-height']: lineHeight,
    fill,
    ['stroke-width']: strokeWidth,
    ['text-anchor']: textAnchor, // omit
    ['dominant-baseline']: dominantBaseline, // omit
    ['font-family']: fontFamily,
    ...restAttrs
  } = attributes;

  const style: Record<string, any> = {
    overflow: 'visible',
    // userSelect: 'none',
  };

  if (fill) style.color = fill;

  Object.entries(restAttrs).forEach(([key, value]) => {
    style[camelCase(key)] = value;
  });

  if (fontSize) style.fontSize = `${fontSize}px`;
  if (lineHeight)
    style.lineHeight =
      typeof lineHeight === 'string' && lineHeight.endsWith('px')
        ? lineHeight
        : +lineHeight;
  if (letterSpacing) style.letterSpacing = `${letterSpacing}px`;
  if (strokeWidth) style.strokeWidth = `${strokeWidth}px`;
  if (fontFamily) style.fontFamily = encodeFontFamily(fontFamily);

  return style;
}

export function getTextContent(text: TextElement): string {
  const entity = getTextEntity(text);
  if (!entity) return '';
  return entity.innerText || entity.textContent || '';
}

export function setTextContent(text: TextElement, content: string): void {
  const entity = getTextEntity(text);
  if (entity) {
    try {
      entity.innerText = content;
    } catch {
      entity.textContent = content;
    }
  }
}

export function getTextElementProps(text: TextElement): Partial<TextProps> {
  const entity = getTextEntity(text);
  if (!entity) return {};

  const {
    color,
    fontSize,
    fontFamily,
    justifyContent,
    alignContent,
    fontWeight,
  } = entity.style;

  const [horizontal, vertical] = flexToAlign(justifyContent, alignContent);

  const attrs: TextAttributes = {
    'data-horizontal-align': horizontal,
    'data-vertical-align': vertical,
  };

  if (fontFamily) attrs['font-family'] = decodeFontFamily(fontFamily);
  if (fontWeight) attrs['font-weight'] = fontWeight;
  if (fontSize) attrs['font-size'] = String(parseInt(fontSize));
  if (color) attrs['fill'] = color;

  return { attributes: attrs, textContent: getTextContent(text) };
}

function flexToAlign(
  justifyContent: string | null | undefined,
  alignContent: string | null | undefined,
): [TextHorizontalAlign, TextVerticalAlign] {
  let horizontal: TextHorizontalAlign = 'LEFT';
  let vertical: TextVerticalAlign = 'TOP';

  switch (justifyContent) {
    case 'flex-start':
      horizontal = 'LEFT';
      break;
    case 'center':
      horizontal = 'CENTER';
      break;
    case 'flex-end':
      horizontal = 'RIGHT';
      break;
  }

  switch (alignContent) {
    case 'flex-start':
      vertical = 'TOP';
      break;
    case 'center':
      vertical = 'MIDDLE';
      break;
    case 'flex-end':
      vertical = 'BOTTOM';
      break;
  }

  return [horizontal, vertical];
}
