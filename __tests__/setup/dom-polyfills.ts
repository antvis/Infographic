/**
 * Polyfill DOMMatrix/DOMPoint for jsdom
 * DOMMatrix and DOMPoint are not available in jsdom, but are required for SVG coordinate transformations.
 */

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
