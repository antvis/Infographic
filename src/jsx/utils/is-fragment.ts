import { Fragment } from '../jsx-runtime';
import { JSXNode } from '../types';

export function isFragment(
  node: JSXNode,
): node is { type: typeof Fragment; props: { children: JSXNode } } {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false;
  return node.type === Fragment;
}
