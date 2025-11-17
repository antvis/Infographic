import type { FragmentProps, JSXElement, JSXNode } from './types';

export const Fragment = Symbol.for('@antv/infographic/Fragment');

export function jsx(
  type: string | symbol | ((props?: any) => JSXNode),
  props: Record<string, any> = {},
): JSXElement {
  return { type, props };
}

export function createFragment(props: FragmentProps = {}): JSXElement {
  return jsx(Fragment, props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
