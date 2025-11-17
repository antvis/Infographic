import type { GroupProps, JSXElement, RectProps, TextProps } from '../types';

const TEXT_ANCHOR_MAP = {
  center: 'middle',
  right: 'end',
  left: 'start',
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

  const calculateTextY = () => {
    if (alignVertical === 'middle') return y + height / 2;
    if (alignVertical === 'bottom') return y + height;

    const fz = +fontSize;
    const ratio = 0.88;
    if (lineHeight && lineHeight > 1) {
      const lineHeightPx = fz * lineHeight;
      const extraSpace = lineHeightPx - fz;
      return y + extraSpace / 2 + fz * ratio;
    }
    return y + fz * ratio;
  };

  const textY = calculateTextY();

  const getDominantBaseline = () => {
    if (alignVertical === 'middle') return 'central';
    if (alignVertical === 'bottom') return 'baseline';
    return 'baseline';
  };

  const textProps = {
    'data-element-type': 'text',
    ...(textX && { x: textX }),
    ...(textY && { y: textY }),
    ...(width && { width }),
    ...(height && { height }),
    ...(x && { 'data-x': x }),
    ...(y && { 'data-y': y }),
    fill,
    fontSize,
    textAnchor: TEXT_ANCHOR_MAP[alignHorizontal],
    dominantBaseline: getDominantBaseline(),
    'data-text-alignment': `${alignHorizontal.toUpperCase()} ${alignVertical.toUpperCase()}`,
    children,
    ...dataAttrs,
    ...restProps,
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

  if (!hasBackground) {
    return {
      type: 'text',
      props: {
        ...containerProps,
        ...textProps,
      },
    };
  }

  const rectProps: RectProps = {
    'data-element-type': 'shape',
    ...bounds,
    fill: backgroundColor,
    fillOpacity: backgroundOpacity,
    rx: backgroundRadius,
    ry: backgroundRadius,
  };

  return {
    type: 'g',
    props: {
      ...containerProps,
      children: [
        { type: 'rect', props: rectProps },
        { type: 'text', props: textProps },
      ],
    },
  };
}
