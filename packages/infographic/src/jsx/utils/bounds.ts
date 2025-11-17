import { isLayoutComponent, performLayout } from '../layout';
import type { Bounds, JSXElement, JSXNode } from '../types';
import { nodeToElements } from './element';
import { isJSXElement } from './is-jsx-element';
import { isNumber } from './is-number';

const zero = (): Bounds => ({ x: 0, y: 0, width: 0, height: 0 });

export function getCombinedBounds(list?: Bounds[] | null): Bounds {
  if (!list || list.length === 0) return zero();

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const bounds of list) {
    const { x, y, width, height } = bounds;
    const x2 = x + width;
    const y2 = y + height;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x2 > maxX) maxX = x2;
    if (y2 > maxY) maxY = y2;
  }

  if (
    minX === Infinity ||
    minY === Infinity ||
    maxX === -Infinity ||
    maxY === -Infinity
  ) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}

export function getElementBounds(node?: JSXNode): Bounds {
  if (!node) return zero();

  if (Array.isArray(node)) {
    const elements = nodeToElements(node);
    return getElementsBounds(elements);
  }

  if (typeof node !== 'object') return zero();

  const { type, props = {} } = node;

  if (isLayoutComponent(node)) {
    const layoutResult = performLayout(node);
    return getElementBounds(layoutResult);
  }

  if (typeof type === 'function') {
    const externalX = props.x ?? 0;
    const externalY = props.y ?? 0;
    const externalWidth = props.width;
    const externalHeight = props.height;

    if (isNumber(externalWidth) && isNumber(externalHeight)) {
      return {
        x: externalX,
        y: externalY,
        width: externalWidth,
        height: externalHeight,
      };
    }

    const renderedResult = type(props) as JSXNode;

    if (!renderedResult) {
      return {
        x: externalX,
        y: externalY,
        width: externalWidth ?? 0,
        height: externalHeight ?? 0,
      };
    }

    if (Array.isArray(renderedResult)) {
      const elements = nodeToElements(renderedResult);
      const innerBounds = getElementsBounds(elements);

      // 如果组件提供了显式尺寸，使用它作为容器边界
      if (isNumber(externalWidth) && isNumber(externalHeight)) {
        return {
          x: externalX,
          y: externalY,
          width: externalWidth,
          height: externalHeight,
        };
      }

      const width =
        innerBounds.width !== 0 ? innerBounds.width : (externalWidth ?? 0);
      const height =
        innerBounds.height !== 0 ? innerBounds.height : (externalHeight ?? 0);

      return {
        x: externalX + innerBounds.x,
        y: externalY + innerBounds.y,
        width,
        height,
      };
    }

    if (isJSXElement(renderedResult)) {
      const innerElement = renderedResult;
      const innerBounds = getElementBounds(innerElement);

      if (isPassthrough(innerElement, props)) {
        return innerBounds;
      }

      const innerHasExplicitSize =
        innerElement.props &&
        isNumber(innerElement.props.width) &&
        isNumber(innerElement.props.height);

      const children = getChildrenFromElement(innerElement);
      const jsxChildren = children.flatMap((child) => nodeToElements(child));
      const innerHasChildren = jsxChildren.length > 0;

      const innerHasSamePosition =
        innerElement.props &&
        innerElement.props.x === props.x &&
        innerElement.props.y === props.y;

      if (innerHasExplicitSize) {
        return {
          x: innerHasSamePosition ? innerBounds.x : externalX + innerBounds.x,
          y: innerHasSamePosition ? innerBounds.y : externalY + innerBounds.y,
          width: innerBounds.width,
          height: innerBounds.height,
        };
      }

      if (isNumber(externalWidth) && isNumber(externalHeight)) {
        if (innerHasChildren) {
          return {
            x: innerHasSamePosition ? innerBounds.x : externalX,
            y: innerHasSamePosition ? innerBounds.y : externalY,
            width: externalWidth,
            height: externalHeight,
          };
        } else {
          return {
            x: innerHasSamePosition ? innerBounds.x : externalX + innerBounds.x,
            y: innerHasSamePosition ? innerBounds.y : externalY + innerBounds.y,
            width: externalWidth,
            height: externalHeight,
          };
        }
      }

      const width =
        innerBounds.width !== 0 ? innerBounds.width : (externalWidth ?? 0);
      const height =
        innerBounds.height !== 0 ? innerBounds.height : (externalHeight ?? 0);

      return {
        x: innerHasSamePosition ? innerBounds.x : externalX + innerBounds.x,
        y: innerHasSamePosition ? innerBounds.y : externalY + innerBounds.y,
        width,
        height,
      };
    }

    return {
      x: externalX,
      y: externalY,
      width: externalWidth ?? 0,
      height: externalHeight ?? 0,
    };
  }

  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const width = isNumber(props.width) ? props.width : undefined;
  const height = isNumber(props.height) ? props.height : undefined;

  if (isNumber(width) && isNumber(height)) {
    return { x, y, width, height };
  }

  // 获取子元素来计算边界
  const children = getChildrenFromElement(node);
  const jsxChildren = children.flatMap((child) => nodeToElements(child));

  if (jsxChildren.length > 0) {
    const innerBounds = getElementsBounds(jsxChildren);

    return {
      x: x + innerBounds.x,
      y: y + innerBounds.y,
      width: isNumber(width) ? width : innerBounds.width,
      height: isNumber(height) ? height : innerBounds.height,
    };
  }

  // 没有子元素且没有显式尺寸
  return {
    x,
    y,
    width: width ?? 0,
    height: height ?? 0,
  };
}

export function getElementsBounds(elements: JSXNode): Bounds {
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return zero();
  }

  const list: Bounds[] = [];

  for (const element of elements) {
    const validElements = nodeToElements(element);

    for (const validElement of validElements) {
      const bounds = getElementBounds(validElement);
      if (bounds) {
        list.push(bounds);
      }
    }
  }

  return getCombinedBounds(list);
}

function isPassthrough(
  innerElement: JSXElement,
  externalProps: Record<string, any>,
): boolean {
  if (!innerElement?.props || !externalProps) {
    return false;
  }

  const inner = innerElement.props;

  // 检查位置是否相同
  if (
    isNumber(inner.x) &&
    isNumber(inner.y) &&
    isNumber(externalProps.x) &&
    isNumber(externalProps.y)
  ) {
    if (inner.x === externalProps.x && inner.y === externalProps.y) {
      // 如果只有位置相同，还需要检查是否都没有显式尺寸
      const innerHasSize = isNumber(inner.width) && isNumber(inner.height);
      const externalHasSize =
        isNumber(externalProps.width) && isNumber(externalProps.height);

      if (!innerHasSize && !externalHasSize) {
        return true;
      }
    }
  }

  // 检查完整的位置和尺寸是否相同
  if (
    isNumber(inner.x) &&
    isNumber(inner.y) &&
    isNumber(inner.width) &&
    isNumber(inner.height) &&
    isNumber(externalProps.x) &&
    isNumber(externalProps.y) &&
    isNumber(externalProps.width) &&
    isNumber(externalProps.height)
  ) {
    return (
      inner.x === externalProps.x &&
      inner.y === externalProps.y &&
      inner.width === externalProps.width &&
      inner.height === externalProps.height
    );
  }

  return false;
}

function getChildrenFromElement(element: JSXElement): JSXNode[] {
  // React 风格：只从 props.children 获取子元素
  const children = element.props?.children;

  if (!children) {
    return [];
  }

  // 标准化为数组
  return Array.isArray(children) ? children : [children];
}
