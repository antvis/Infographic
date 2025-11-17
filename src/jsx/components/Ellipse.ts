import type { EllipseProps, JSXElement } from '../types';

export function Ellipse(props: EllipseProps): JSXElement {
  const { x = 0, y = 0, width = 0, height = 0 } = props;
  props.cx ??= x + width / 2;
  props.cy ??= y + height / 2;
  props.rx ??= width / 2;
  props.ry ??= height / 2;
  const node: JSXElement = {
    type: 'ellipse',
    props,
  };
  return node;
}
