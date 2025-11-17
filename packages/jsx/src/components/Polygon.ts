import type { JSXElement, PolygonProps } from '../types';

export function Polygon({ points = [], ...props }: PolygonProps): JSXElement {
  const { x, y } = props;
  const pointsStr = points.map(({ x, y }) => `${x},${y}`).join(' ');

  const finalProps = {
    ...props,
    points: pointsStr,
  };

  if (x !== undefined || y !== undefined) {
    finalProps.transform = `translate(${x ?? 0}, ${y ?? 0})`;
  }

  const node: JSXElement = {
    type: 'polygon',
    props: finalProps,
  };
  return node;
}
