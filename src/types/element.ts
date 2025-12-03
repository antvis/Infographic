export type GeometryElement = SVGGraphicsElement;
export type TextElement = SVGForeignObjectElement;
export type IconElement = SVGUseElement | SVGGElement;
export type ButtonElement = SVGUseElement;
export type IllusElement = SVGGElement;
export type IllusEntity = SVGUseElement;
export type IllusVolume = SVGRectElement;
export type Element =
  | GeometryElement
  | TextElement
  | IconElement
  | ButtonElement
  | IllusElement;
