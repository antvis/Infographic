import type { LayoutDirection, ParsedInfographicOptions } from '../options';
import type { ParsedPadding, TextElement, TextHorizontalAlign } from '../types';
import {
  createElement,
  getTextEntity,
  getTextHorizontalAlign,
  getViewBox,
  isIllus,
  isItemIcon,
  parseViewBox,
  setTextPhysicalHorizontalAlign,
  traverse,
} from '../utils';

/**
 * Right-to-left layout as a post-render pass: the whole infographic is
 * mirrored horizontally, then every element that must stay readable (an
 * "unmirrored atom") is mirrored back in place. Designs never see the
 * direction.
 */
export function applyLayoutDirection(
  svg: SVGSVGElement,
  options: Pick<ParsedInfographicOptions, 'direction' | 'viewBox'>,
) {
  if (options.direction !== 'rtl') return;

  const { x, width } = options.viewBox
    ? parseViewBox(options.viewBox)
    : getViewBox(svg);
  const mirror = createElement<SVGGElement>('g', {
    transform: horizontalMirror(x + width / 2),
  });
  mirror.append(...Array.from(svg.childNodes));
  svg.append(mirror);

  unmirrorAtoms(mirror);
}

/** Padding sides as applied to the view: in RTL, left and right trade places. */
export function toPhysicalPadding(
  padding: ParsedPadding,
  direction: LayoutDirection | undefined,
): ParsedPadding {
  if (direction !== 'rtl') return padding;
  const [top, right, bottom, left] = padding;
  return [top, left, bottom, right];
}

interface UnmirroredAtom {
  matches: (element: SVGElement) => boolean;
  unmirror: (element: SVGElement) => void;
}

// Tags are compared by name, not via `isText` & co.: `instanceof` fails across
// DOM realms (SSR).
const UNMIRRORED_ATOMS: UnmirroredAtom[] = [
  {
    matches: (element) => tagNameOf(element) === 'foreignobject',
    unmirror: unmirrorTextBox,
  },
  {
    matches: (element) => tagNameOf(element) === 'text',
    unmirror: unmirrorSVGText,
  },
  {
    matches: (element) =>
      tagNameOf(element) === 'use' && (isItemIcon(element) || isIllus(element)),
    unmirror: unmirrorBox,
  },
];

/** Shown only through a reference; the referencing atom decides. */
const NON_RENDERED_CONTAINERS = new Set([
  'defs',
  'symbol',
  'clippath',
  'mask',
  'pattern',
  'marker',
]);

function unmirrorAtoms(root: SVGElement) {
  traverse(root, (element) => {
    if (NON_RENDERED_CONTAINERS.has(tagNameOf(element))) return false;
    const atom = UNMIRRORED_ATOMS.find(({ matches }) => matches(element));
    if (!atom) return;
    atom.unmirror(element);
    return false;
  });
}

const MIRRORED_ALIGN: Record<TextHorizontalAlign, TextHorizontalAlign> = {
  LEFT: 'RIGHT',
  CENTER: 'CENTER',
  RIGHT: 'LEFT',
};

const MIRRORED_TEXT_ANCHOR: Record<string, string> = {
  start: 'end',
  middle: 'middle',
  end: 'start',
};

function unmirrorBox(element: SVGElement) {
  mirrorInPlace(
    element,
    numberAttribute(element, 'x') + numberAttribute(element, 'width') / 2,
  );
}

function unmirrorTextBox(element: SVGElement) {
  const text = element as TextElement; // matched as a foreignObject
  unmirrorBox(text);
  const entity = getTextEntity(text);
  if (!entity) return;
  setTextPhysicalHorizontalAlign(
    text,
    MIRRORED_ALIGN[getTextHorizontalAlign(text)],
  );
  entity.setAttribute('dir', 'auto');
}

/**
 * Pivot on the anchor point and swap the anchor: the text then occupies the
 * mirror of its box without being measured.
 */
function unmirrorSVGText(text: SVGElement) {
  mirrorInPlace(text, numberAttribute(text, 'x'));
  const anchor = text.getAttribute('text-anchor') || 'start';
  text.setAttribute('text-anchor', MIRRORED_TEXT_ANCHOR[anchor] ?? anchor);
  text.style.setProperty('unicode-bidi', 'plaintext');
}

/**
 * Appended as the innermost transform so it acts in the element's own
 * coordinates, whatever transform the design already set.
 */
function mirrorInPlace(element: SVGElement, pivotX: number) {
  const existing = element.getAttribute('transform');
  const mirror = horizontalMirror(pivotX);
  element.setAttribute(
    'transform',
    existing ? `${existing} ${mirror}` : mirror,
  );
}

function horizontalMirror(pivotX: number) {
  return `matrix(-1 0 0 1 ${2 * pivotX} 0)`;
}

function numberAttribute(element: SVGElement, name: string) {
  return parseFloat(element.getAttribute(name) ?? '') || 0;
}

const tagNameOf = (element: SVGElement) => element.tagName.toLowerCase();
