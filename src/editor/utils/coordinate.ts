import { getLayoutRoot } from '../../renderer/rtl';
import type { Element } from '../../types';

export function getScreenCTM(svg: SVGSVGElement): DOMMatrix {
  return svg.getScreenCTM() || new DOMMatrix();
}

export function getInverseScreenCTM(svg: SVGGraphicsElement): DOMMatrix {
  return svg.getScreenCTM()?.inverse() || new DOMMatrix();
}

export function viewportToClient(
  svg: SVGSVGElement,
  x: number,
  y: number,
): DOMPoint {
  const svgPoint = new DOMPoint(x, y).matrixTransform(getScreenCTM(svg));
  const containerBounds = svg.getBoundingClientRect();
  return new DOMPoint(
    svgPoint.x - containerBounds.left,
    svgPoint.y - containerBounds.top,
  );
}

/** Into the layout's own space (mirrored in RTL), where element geometry lives. */
export function clientToViewport(
  svg: SVGSVGElement,
  x: number,
  y: number,
): DOMPoint {
  return new DOMPoint(x, y).matrixTransform(
    getInverseScreenCTM(getLayoutRoot(svg)),
  );
}

/** Into the svg's own space, where its viewBox lives. */
export function clientToViewBox(
  svg: SVGSVGElement,
  x: number,
  y: number,
): DOMPoint {
  return new DOMPoint(x, y).matrixTransform(getInverseScreenCTM(svg));
}

export function getElementViewportBounds(
  svg: SVGSVGElement,
  element: Element,
): DOMRect {
  const bounds = element.getBoundingClientRect();
  const points = [
    { x: bounds.x, y: bounds.y }, // 左上
    { x: bounds.x + bounds.width, y: bounds.y }, // 右上
    { x: bounds.x, y: bounds.y + bounds.height }, // 左下
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height }, // 右下
  ];

  const transformedPoints = points.map((point) => {
    return clientToViewport(svg, point.x, point.y);
  });

  const minX = Math.min(...transformedPoints.map((p) => p.x));
  const maxX = Math.max(...transformedPoints.map((p) => p.x));
  const minY = Math.min(...transformedPoints.map((p) => p.y));
  const maxY = Math.max(...transformedPoints.map((p) => p.y));

  return new DOMRect(minX, minY, maxX - minX, maxY - minY);
}
