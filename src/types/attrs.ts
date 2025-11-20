export type NumericalValue = number | string | undefined;
export type TextualValue = string | undefined;

export type BaseAttributes = {
  opacity?: NumericalValue;
  fill?: TextualValue;
  'fill-opacity'?: NumericalValue;
  stroke?: TextualValue;
  'stroke-opacity'?: NumericalValue;
};

export type IconAttributes = {
  id?: NumericalValue;
  class?: NumericalValue;
  x?: NumericalValue;
  y?: NumericalValue;
  width?: NumericalValue;
  height?: NumericalValue;
  href?: NumericalValue;
  fill?: NumericalValue;
  'fill-opacity'?: NumericalValue;
  opacity?: NumericalValue;
};

export type TextAttributes = {
  id?: NumericalValue;
  class?: NumericalValue;
  x?: NumericalValue;
  y?: NumericalValue;
  width?: NumericalValue;
  height?: NumericalValue;
  'text-alignment'?: TextualValue;
  'font-family'?: TextualValue;
  'font-size'?: NumericalValue;
  'font-weight'?: NumericalValue;
  'font-style'?: NumericalValue;
  'font-variant'?: NumericalValue;
  'letter-spacing'?: NumericalValue;
  'line-height'?: NumericalValue;
  fill?: NumericalValue;
  stroke?: NumericalValue;
  'stroke-width'?: NumericalValue;
  'text-anchor'?: NumericalValue;
  'dominant-baseline'?: NumericalValue;
};

export type ShapeAttributes = {
  opacity?: NumericalValue;
  fill?: TextualValue;
  'fill-opacity'?: NumericalValue;
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
  stroke?: TextualValue;
  'stroke-width'?: NumericalValue;
  'stroke-linecap'?: NumericalValue;
  'stroke-linejoin'?: NumericalValue;
  'stroke-dasharray'?: NumericalValue;
  'stroke-dashoffset'?: NumericalValue;
  'stroke-opacity'?: NumericalValue;
};

export type IllusAttributes = {
  x: NumericalValue;
  y: NumericalValue;
  width: NumericalValue;
  height: NumericalValue;
  'clip-path'?: TextualValue;
};
