import { describe, expect, it } from 'vitest';
import {
  clientToViewport,
  getElementViewportBounds,
  getInverseScreenCTM,
  getScreenCTM,
  viewportToClient,
} from '../../../../src/editor/utils/coordinate';
import type { Element } from '../../../../src/types';

const createSVG = (matrix?: DOMMatrix) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const bounds = { x: 0, y: 0, width: 200, height: 100 };
  svg.getBoundingClientRect = () => ({
    ...bounds,
    top: bounds.y,
    left: bounds.x,
    right: bounds.x + bounds.width,
    bottom: bounds.y + bounds.height,
    toJSON: () => bounds,
  });
  svg.getScreenCTM = () => matrix || new DOMMatrix().translate(5, 5);
  return svg as SVGSVGElement;
};

describe('editor/utils/coordinate', () => {
  it('returns screen ctm and inverse safely', () => {
    const svg = createSVG();
    expect(getScreenCTM(svg)).toBeInstanceOf(DOMMatrix);
    expect(getInverseScreenCTM(svg)).toBeInstanceOf(DOMMatrix);
  });

  it('converts between viewport and client coordinates', () => {
    const matrix = new DOMMatrix().translate(10, 15);
    const svg = createSVG(matrix);

    const client = viewportToClient(svg, 0, 0);
    expect(client.x).toBeCloseTo(10);
    expect(client.y).toBeCloseTo(15);

    const viewport = clientToViewport(svg, client.x, client.y);
    expect(viewport.x).toBeCloseTo(0);
    expect(viewport.y).toBeCloseTo(0);
  });

  it('computes viewport bounds for an element by transforming its corners', () => {
    const svg = createSVG(new DOMMatrix());
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.getBoundingClientRect = () =>
      ({
        x: 30,
        y: 40,
        width: 50,
        height: 60,
        top: 40,
        left: 30,
        right: 80,
        bottom: 100,
        toJSON: () => null,
      }) as any;

    const bounds = getElementViewportBounds(svg, rect as unknown as Element);
    expect(bounds.x).toBe(30);
    expect(bounds.y).toBe(40);
    expect(bounds.width).toBe(50);
    expect(bounds.height).toBe(60);
  });
});
// Polyfill DOMMatrix/DOMPoint for jsdom
class Matrix {
  e = 0;
  f = 0;
  translate(x = 0, y = 0) {
    this.e += x;
    this.f += y;
    return this;
  }
  inverse() {
    const m = new Matrix();
    m.e = -this.e;
    m.f = -this.f;
    return m;
  }
}

class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
  matrixTransform(matrix: any) {
    return new Point(this.x + (matrix?.e || 0), this.y + (matrix?.f || 0));
  }
}

// @ts-expect-error test polyfill
globalThis.DOMMatrix ??= Matrix;
// @ts-expect-error test polyfill
globalThis.DOMPoint ??= Point;
