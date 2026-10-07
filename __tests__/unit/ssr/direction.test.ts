import { describe, expect, it, vi } from 'vitest';
import { renderToString } from '../../../src/ssr';
import { parseViewBox } from '../../../src/utils/viewbox';
import {
  applyToPoint,
  determinant,
  getTransformToRoot,
  type Matrix,
} from '../../utils';
import { EXAMPLE_FILES, expectGolden, readExample } from './helpers';

vi.mock('../../../src/utils/fetch.ts', async (importOriginal) => {
  const { withMockedIcons } = await import('./helpers');
  return withMockedIcons(await importOriginal());
});

describe('SSR direction', () => {
  const RTL = { direction: 'rtl' } as const;

  it('should render 02-list-with-icons.txt right-to-left', async () => {
    const result = await renderToString(
      readExample('02-list-with-icons.txt'),
      RTL,
    );

    expectGolden('12-rtl-list-with-icons.svg', result);
  });

  const rotatedSVGTextExample = `infographic sequence-zigzag-pucks-3d
data
  title Release Steps
  lists
    - label Plan
      desc Define the scope
    - label Build
      desc Implement and test
    - label Ship
      desc Release to users`;

  it.each([
    ...EXAMPLE_FILES.map((file) => [file, readExample(file)]),
    ['rotated SVG text', rotatedSVGTextExample],
  ])('should mirror %s with every atom kept readable', async (_, input) => {
    const ltr = parseSVG(await renderToString(input));
    const rtl = parseSVG(await renderToString(input, RTL));

    expect(rtl.getAttribute('viewBox')).toBe(ltr.getAttribute('viewBox'));
    const { x, width } = parseViewBox(ltr.getAttribute('viewBox')!);
    const pivotX = x + width / 2;

    const ltrAtoms = collectAtoms(ltr);
    const rtlAtoms = collectAtoms(rtl);
    expect(rtlAtoms.map(getTagName)).toEqual(ltrAtoms.map(getTagName));
    expect(ltrAtoms.length).toBeGreaterThan(0);

    ltrAtoms.forEach((ltrAtom, i) => {
      const rtlAtom = rtlAtoms[i];
      const ltrMatrix = getTransformToRoot(ltrAtom, ltr);
      const rtlMatrix = getTransformToRoot(rtlAtom, rtl);
      expect(determinant(rtlMatrix)).toBeGreaterThan(0);

      if (getTagName(ltrAtom) === 'text') {
        const ltrAnchor = anchorPoint(ltrAtom, ltrMatrix);
        const rtlAnchor = anchorPoint(rtlAtom, rtlMatrix);
        expect(rtlAnchor.x).toBeCloseTo(2 * pivotX - ltrAnchor.x, 0);
        expect(rtlAnchor.y).toBeCloseTo(ltrAnchor.y, 0);
        expect(rtlAtom.getAttribute('text-anchor')).toBe(
          MIRRORED_ANCHOR[ltrAtom.getAttribute('text-anchor') ?? 'start'],
        );
        expect(rtlAtom.getAttribute('style')).toMatch(
          /unicode-bidi:\s*plaintext/,
        );
        return;
      }

      const ltrBox = boxInRoot(ltrAtom, ltrMatrix);
      const rtlBox = boxInRoot(rtlAtom, rtlMatrix);
      expect(rtlBox.left).toBeCloseTo(2 * pivotX - ltrBox.right, 0);
      expect(rtlBox.right).toBeCloseTo(2 * pivotX - ltrBox.left, 0);
      expect(rtlBox.top).toBeCloseTo(ltrBox.top, 0);
      expect(rtlBox.bottom).toBeCloseTo(ltrBox.bottom, 0);

      if (getTagName(ltrAtom) === 'foreignobject') {
        const ltrSpan = ltrAtom.firstElementChild!;
        const rtlSpan = rtlAtom.firstElementChild!;
        expect(rtlSpan.getAttribute('dir')).toBe('auto');
        expect(justifyContentOf(rtlSpan)).toBe(
          MIRRORED_JUSTIFY_CONTENT[justifyContentOf(ltrSpan)],
        );
      }
    });
  });

  it('should mirror asymmetric padding', async () => {
    const input = readExample('01-basic-list.txt');
    const padding = [0, 50, 0, 10];
    const ltr = parseSVG(await renderToString(input, { padding }));
    const rtl = parseSVG(await renderToString(input, { padding, ...RTL }));

    const ltrViewBox = parseViewBox(ltr.getAttribute('viewBox')!);
    const rtlViewBox = parseViewBox(rtl.getAttribute('viewBox')!);
    // Content mirrors about its own centre, so the frame's left edge moves by left − right.
    expect(rtlViewBox).toEqual({
      ...ltrViewBox,
      x: ltrViewBox.x + padding[3] - padding[1],
    });
  });
});

const MIRRORED_ANCHOR: Record<string, string> = {
  start: 'end',
  middle: 'middle',
  end: 'start',
};

const MIRRORED_JUSTIFY_CONTENT: Record<string, string> = {
  'flex-start': 'right',
  center: 'center',
  'flex-end': 'left',
};

const NON_RENDERED_CONTAINERS = [
  'defs',
  'symbol',
  'clippath',
  'mask',
  'pattern',
  'marker',
];

const getTagName = (element: Element) => element.tagName.toLowerCase();

function parseSVG(markup: string) {
  return new DOMParser().parseFromString(markup, 'image/svg+xml')
    .documentElement;
}

/** Elements the spec keeps unmirrored: text (R4), item icons and illustrations (R6). */
function collectAtoms(root: Element): Element[] {
  const atoms: Element[] = [];
  const visit = (element: Element) => {
    const tagName = getTagName(element);
    if (NON_RENDERED_CONTAINERS.includes(tagName)) return;
    const role = element.getAttribute('data-element-type');
    if (
      tagName === 'foreignobject' ||
      tagName === 'text' ||
      (tagName === 'use' && (role === 'item-icon' || role === 'illus'))
    ) {
      atoms.push(element);
      return;
    }
    Array.from(element.children).forEach(visit);
  };
  visit(root);
  return atoms;
}

const numberAttribute = (element: Element, name: string) =>
  parseFloat(element.getAttribute(name) ?? '') || 0;

function anchorPoint(text: Element, matrix: Matrix) {
  return applyToPoint(
    matrix,
    numberAttribute(text, 'x'),
    numberAttribute(text, 'y'),
  );
}

function boxInRoot(element: Element, matrix: Matrix) {
  const [x, y] = [numberAttribute(element, 'x'), numberAttribute(element, 'y')];
  const [width, height] = [
    numberAttribute(element, 'width'),
    numberAttribute(element, 'height'),
  ];
  const corners = [
    applyToPoint(matrix, x, y),
    applyToPoint(matrix, x + width, y),
    applyToPoint(matrix, x, y + height),
    applyToPoint(matrix, x + width, y + height),
  ];
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}

const justifyContentOf = (span: Element) =>
  span.getAttribute('style')?.match(/justify-content:\s*([\w-]+)/)?.[1] ?? '';
