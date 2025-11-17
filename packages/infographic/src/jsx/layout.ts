import type {
  ComponentType,
  JSXElement,
  JSXNode,
  RenderContext,
  WithChildren,
} from './types';
import { createDefaultContext, getRenderableChildrenOf } from './utils';

type LayoutComponent = JSXElement & { type: symbol };

type LayoutFunction<T = {}> = (
  children: JSXElement[],
  props: WithChildren<T>,
  context: RenderContext,
) => JSXElement;

const LAYOUT_FN_MAP = new Map<symbol, LayoutFunction<any>>();

export function createLayout<T = {}>(fn: LayoutFunction<T>): ComponentType<T> {
  const type = Symbol('layout');
  LAYOUT_FN_MAP.set(type, fn);
  const LayoutComponent: ComponentType<T> = (props) => ({ type, props });
  return LayoutComponent;
}

export function isLayoutComponent(
  element: JSXNode,
): element is LayoutComponent {
  return (
    element != null &&
    typeof element === 'object' &&
    !Array.isArray(element) &&
    typeof element.type === 'symbol' &&
    LAYOUT_FN_MAP.has(element.type)
  );
}

export function performLayout(
  element: LayoutComponent,
  context: RenderContext = createDefaultContext(),
): JSXElement {
  const layoutFn = LAYOUT_FN_MAP.get(element.type);
  if (!layoutFn) {
    console.warn('Layout function not found for symbol:', element.type);
    return element;
  }

  const children = getRenderableChildrenOf(element).filter((child) => {
    // ignore text nodes
    return typeof child === 'object';
  }) as JSXElement[];

  return layoutFn(children, element.props, context);
}
