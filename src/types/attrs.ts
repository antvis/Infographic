export type IconAttributes = {
  id?: number | string | undefined;
  class?: number | string | undefined;
  x?: number | string | undefined;
  y?: number | string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  href?: number | string | undefined;
  fill?: number | string | undefined;
  'fill-opacity'?: number | string | undefined;
  opacity?: number | string | undefined;
};

export type TextAttributes = {
  id?: number | string | undefined;
  class?: number | string | undefined;
  x?: number | string | undefined;
  y?: number | string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  'text-alignment'?: string | undefined;
  'font-family'?: string | undefined;
  'font-size'?: number | string | undefined;
  'font-weight'?: number | string | undefined;
  'font-style'?: number | string | undefined;
  'font-variant'?: number | string | undefined;
  'letter-spacing'?: number | string | undefined;
  'line-height'?: number | string | undefined;
  fill?: number | string | undefined;
  stroke?: number | string | undefined;
  'stroke-width'?: number | string | undefined;
  'text-anchor'?: number | string | undefined;
  'dominant-baseline'?: number | string | undefined;
};

export type ShapeAttributes = {
  opacity?: number | string | undefined;
  fill?: string | undefined;
  'fill-opacity'?: number | string | undefined;
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
  stroke?: string | undefined;
  'stroke-width'?: number | string | undefined;
  'stroke-linecap'?: number | string | undefined;
  'stroke-linejoin'?: number | string | undefined;
  'stroke-dasharray'?: number | string | undefined;
  'stroke-dashoffset'?: number | string | undefined;
  'stroke-opacity'?: number | string | undefined;
};

export type IllusAttributes = {
  x: number | string | undefined;
  y: number | string | undefined;
  width: number | string | undefined;
  height: number | string | undefined;
  'clip-path'?: string | undefined;
};
