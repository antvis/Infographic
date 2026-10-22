/** Affine matrix [a, b, c, d, e, f]: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = [number, number, number, number, number, number];

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

export function multiply(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export function applyToPoint(m: Matrix, x: number, y: number) {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

/** Negative for a mirroring transform. */
export function determinant(m: Matrix) {
  return m[0] * m[3] - m[1] * m[2];
}

/** Parses an SVG `transform` attribute (matrix/translate/scale/rotate/skewX/skewY). */
export function parseTransform(value: string | null): Matrix {
  if (!value) return IDENTITY;
  const functions = value.matchAll(/(\w+)\s*\(([^)]*)\)/g);
  let result = IDENTITY;
  for (const [, name, rawArgs] of functions) {
    const args = rawArgs
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    result = multiply(result, toMatrix(name, args));
  }
  return result;
}

function toMatrix(name: string, args: number[]): Matrix {
  switch (name) {
    case 'matrix':
      return args as Matrix;
    case 'translate':
      return [1, 0, 0, 1, args[0], args[1] ?? 0];
    case 'scale':
      return [args[0], 0, 0, args[1] ?? args[0], 0, 0];
    case 'rotate': {
      const [angle, cx = 0, cy = 0] = args;
      const rad = (angle * Math.PI) / 180;
      const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
      return multiply(
        multiply([1, 0, 0, 1, cx, cy], [cos, sin, -sin, cos, 0, 0]),
        [1, 0, 0, 1, -cx, -cy],
      );
    }
    case 'skewX':
      return [1, 0, Math.tan((args[0] * Math.PI) / 180), 1, 0, 0];
    case 'skewY':
      return [1, Math.tan((args[0] * Math.PI) / 180), 0, 1, 0, 0];
    default:
      throw new Error(`Unsupported transform: ${name}`);
  }
}

/** Composed transform from `root`'s user space down to `element`'s own (inclusive). */
export function getTransformToRoot(element: Element, root: Element): Matrix {
  const chain: Element[] = [];
  for (let node: Element | null = element; node && node !== root;) {
    chain.unshift(node);
    node = node.parentElement;
  }
  return chain.reduce(
    (matrix, node) =>
      multiply(matrix, parseTransform(node.getAttribute('transform'))),
    IDENTITY,
  );
}
