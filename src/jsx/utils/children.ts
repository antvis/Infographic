import type { JSXNode, RenderableNode } from '../types';
import { nodeToRenderableNodes } from './element';

export function getRenderableChildrenOf(element: JSXNode): RenderableNode[] {
  if (
    element === null ||
    element === undefined ||
    typeof element === 'boolean'
  ) {
    return [];
  }

  if (Array.isArray(element)) return nodeToRenderableNodes(element);

  if (typeof element === 'object') {
    return nodeToRenderableNodes(element.props?.children);
  }

  return [element];
}
