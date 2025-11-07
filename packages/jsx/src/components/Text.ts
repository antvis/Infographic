import type { GroupProps, JSXElement, RectProps, TextProps } from '../types';

const TEXT_ANCHOR_MAP = {
  center: 'middle',
  right: 'end',
  left: 'start',
} as const;

const DOMINANT_BASELINE_MAP = {
  center: 'central',
  bottom: 'text-after-edge',
  top: 'hanging',
} as const;

export function Text(props: TextProps): JSXElement {
  const {
    id,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    alignHorizontal = 'left',
    alignVertical = 'top',
    children,
    fontSize = 14,
    fontFamily,
    fontStyle,
    fontWeight,
    textDecoration,
    letterSpacing,
    wordSpacing,
    opacity,
    fill = 'black',
    lineHeight,
    wordWrap,
    backgroundColor = 'none',
    backgroundOpacity = 1,
    backgroundRadius = 0,
    ...restProps
  } = props;

  const dataAttrs = Object.entries({
    ...(lineHeight !== undefined && { 'line-height': lineHeight }),
    ...(wordWrap !== undefined && { 'data-word-wrap': wordWrap }),
    ...(width !== undefined && { width: width }),
    ...(height !== undefined && { height: height }),
  }).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const textX =
    alignHorizontal === 'center'
      ? x + width / 2
      : alignHorizontal === 'right'
        ? x + width
        : x;

  const textY =
    alignVertical === 'center'
      ? y + height / 2
      : alignVertical === 'bottom'
        ? y + height
        : y;

  const textProps: Record<string, any> = {
    ...(textX && { x: textX }),
    ...(textY && { y: textY }),
    fill,
    fontSize,
    textAnchor: TEXT_ANCHOR_MAP[alignHorizontal],
    dominantBaseline: DOMINANT_BASELINE_MAP[alignVertical],
    'data-text-alignment': `${alignHorizontal.toUpperCase()} ${alignVertical.toUpperCase()}`,
    children,
    ...dataAttrs,
    ...restProps,
    ...(id && { id: `${id}-text` }),
    ...(fontFamily && { fontFamily }),
    ...(fontStyle && { fontStyle }),
    ...(fontWeight && { fontWeight }),
    ...(textDecoration && textDecoration !== 'none' && { textDecoration }),
    ...(letterSpacing && { letterSpacing }),
    ...(wordSpacing && { wordSpacing }),
    ...(opacity !== undefined && opacity !== 1 && { opacity }),
  };

  const bounds = {
    ...(x && { x }),
    ...(y && { y }),
    ...(width && { width }),
    ...(height && { height }),
  };

  const containerProps: GroupProps = {
    ...bounds,
    ...(id && { id }),
  };

  const hasBackground = backgroundColor && backgroundColor !== 'none';

  const elements: JSXElement[] = [];

  if (hasBackground) {
    const rectProps: RectProps = {
      ...bounds,
      fill: backgroundColor,
      fillOpacity: backgroundOpacity,
      rx: backgroundRadius,
      ry: backgroundRadius,
      ...(id && { id: `${id}-bounds` }),
    };
    elements.push({
      type: 'rect',
      props: rectProps,
    });
  }

  elements.push({
    type: 'text',
    props: textProps,
  });

  return {
    type: 'g',
    props: {
      ...containerProps,
      children: elements,
    },
  };
}
