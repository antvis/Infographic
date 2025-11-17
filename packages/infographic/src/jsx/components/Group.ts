import type { GroupProps, JSXElement } from '../types';

export function Group(props: GroupProps): JSXElement {
  const { x = 0, y = 0 } = props;
  if (x || y) {
    props.transform ||= `translate(${x}, ${y})`;
  }
  const node: JSXElement = {
    type: 'g',
    props,
  };
  return node;
}
