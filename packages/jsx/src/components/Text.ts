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
    if (alignVertical === 'center') return y + height / 2;
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
    if (alignVertical === 'center') return 'central';
    if (alignVertical === 'bottom') return 'baseline';
    return 'baseline';
  };

  const textProps = {
    ...(textX && { x: textX }),
    ...(textY && { y: textY }),
    fill,
    fontSize,
    textAnchor: TEXT_ANCHOR_MAP[alignHorizontal],
    dominantBaseline: getDominantBaseline(),
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
  const rectProps: RectProps = {
    ...bounds,
    fill: backgroundColor,
    ...(hasBackground && {
      fillOpacity: backgroundOpacity,
      rx: backgroundRadius,
      ry: backgroundRadius,
    }),
    ...(id && { id: `${id}-bounds` }),
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
