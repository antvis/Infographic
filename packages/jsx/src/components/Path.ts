import type { JSXElement, PathProps } from '../types';

export function Path(props: PathProps): JSXElement {
  const { x, y } = props;

  const finalProps = {
    ...props,
  };

  if (x !== undefined || y !== undefined) {
    finalProps.transform = `translate(${x ?? 0}, ${y ?? 0})`;
  }

  const node: JSXElement = {
    type: 'path',
    props: finalProps,
  };

  return node;
}
