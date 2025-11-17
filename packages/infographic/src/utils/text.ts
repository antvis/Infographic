import camelCase from 'lodash-es/camelCase';
import { ElementTypeEnum } from '../constants';
import { encodeFontFamily, TextAlignment } from '../renderer';
import type { TextAttributes, TextElement } from '../types';
import { createElement } from './svg';

export function createTextElement(
  textContent: string,
  attributes: TextAttributes,
): TextElement {
  const span = document.createElement('span');

  span.textContent = textContent;
  Object.assign(span.style, getTextStyle(attributes));

  let { width, height } = attributes;

  if (!width || !height) {
    const rect = measureTextSpan(span);
    if (!width) width = String(rect.width);
    if (!height) height = String(rect.height);
  }

  // 以下属性需要完成包围盒测量后再设置
  const { id, x, y, 'text-alignment': textAlignment = 'LEFT TOP' } = attributes;
  const [horizontal, vertical] = getTextAlignment(textAlignment);
  Object.assign(span.style, alignToFlex(horizontal, vertical));

  const foreignObject = createElement<SVGForeignObjectElement>(
    'foreignObject',
    {
      id,
      x,
      y,
      width,
      height,
      overflow: 'visible',
      'data-element-type': ElementTypeEnum.Text,
    },
  );

  foreignObject.appendChild(span);

  return foreignObject;
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

function getTextStyle(attributes: TextAttributes) {
  const {
    x,
    y,
    width,
    height,
    ['text-alignment']: textAlignment,
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
    color: fill,
    overflow: 'visible',
    // userSelect: 'none',
  };

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

function measureTextSpan(span: HTMLSpanElement) {
  const parentNode = span.parentNode;
  span.style.visibility = 'hidden';
  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  if (parentNode) parentNode.appendChild(span);
  else document.body.removeChild(span);
  span.style.visibility = 'visible';
  return rect;
}

function getTextAlignment(alignment: string): TextAlignment {
  if (!alignment) {
    return ['LEFT', 'TOP'];
  }

  const [horizontal = 'CENTER', vertical = 'MIDDLE'] = alignment.split(' ');
  return [horizontal, vertical] as TextAlignment;
}
