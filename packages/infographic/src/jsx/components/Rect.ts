import type { JSXElement, RectProps } from '../types';

export function Rect(props: RectProps): JSXElement {
  const node: JSXElement = {
    type: 'rect',
    props,
  };
  return node;
}
