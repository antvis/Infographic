import type { DefsProps, JSXElement } from '../types';

export const DefsSymbol = Symbol.for('@antv/infographic/Defs');

export function Defs(props: DefsProps): JSXElement {
  const node: JSXElement = {
    type: DefsSymbol,
    props,
  };
  return node;
}
