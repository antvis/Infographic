import { TextHorizontalAlign, TextVerticalAlign } from './text';

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
  id?: TextualValue;
  class?: TextualValue;
  x?: NumericalValue;
  y?: NumericalValue;
  width?: NumericalValue;
  height?: NumericalValue;
  href?: TextualValue;
  fill?: TextualValue;
  'fill-opacity'?: NumericalValue;
  opacity?: NumericalValue;
};

export type TextAttributes = {
  id?: TextualValue;
  class?: TextualValue;
  x?: NumericalValue;
  y?: NumericalValue;
  width?: NumericalValue;
  height?: NumericalValue;
  'font-family'?: TextualValue;
  'font-size'?: NumericalValue;
  'font-weight'?: NumericalValue;
  'font-style'?: NumericalValue;
  'font-variant'?: NumericalValue;
  'letter-spacing'?: NumericalValue;
  'line-height'?: NumericalValue;
  fill?: TextualValue;
  stroke?: TextualValue;
  'stroke-width'?: NumericalValue;
  'text-anchor'?: TextualValue;
  'dominant-baseline'?: TextualValue;
  // extend for alignment
  'data-horizontal-align'?: TextHorizontalAlign;
  'data-vertical-align'?: TextVerticalAlign;
};

export type ShapeAttributes = {
  opacity?: NumericalValue;
  fill?: TextualValue;
  'fill-opacity'?: NumericalValue;
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit' | undefined;
  stroke?: TextualValue;
  'stroke-width'?: NumericalValue;
  'stroke-linecap'?: TextualValue;
  'stroke-linejoin'?: TextualValue;
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
