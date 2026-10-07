import type { LayoutDirection, ParsedInfographicOptions } from '../options';
import type { ParsedPadding, TextElement, TextHorizontalAlign } from '../types';
import {
  createElement,
  flexToAlign,
  getTextEntity,
  getViewBox,
  isIllus,
  isItemIcon,
  parseViewBox,
  traverse,
} from '../utils';

/** Marks the group holding the whole mirrored layout. */
const MIRROR_ATTRIBUTE = 'data-layout-mirror';
/** Marks the group flipping one box atom back; owned by this module, never by designs or the editor. */
const FLIP_ATTRIBUTE = 'data-layout-flip';

/**
 * Right-to-left layout as a post-render pass: the whole infographic is
 * mirrored horizontally, then every element that must stay readable (an
 * "unmirrored atom") is flipped back in place. Designs never see the
 * direction; the editor keeps working in the mirrored (logical LTR) space.
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
    [MIRROR_ATTRIBUTE]: '',
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

/** The group whose user space is the layout's own (mirrored in RTL); the svg itself otherwise. */
export function getLayoutRoot(svg: SVGSVGElement): SVGGraphicsElement {
  return (
    svg.querySelector<SVGGElement>(`:scope > [${MIRROR_ATTRIBUTE}]`) ?? svg
  );
}

/**
 * Re-centres an atom's flip after its geometry or alignment was written, so it
 * stays readable in place; no-op for anything not flipped by this module.
 */
export function syncUnmirroredAtom(element: Element) {
  const flip = element.parentElement;
  if (!flip?.hasAttribute(FLIP_ATTRIBUTE)) return;
  flip.setAttribute('transform', boxFlip(element as SVGElement));
  if (tagNameOf(element as SVGElement) === 'foreignobject') {
    mirrorTextAlign(element as TextElement);
  }
}

/** Sides with a horizontal mirror image: alignments, and the diagonal resize cursors. */
const MIRRORED_SIDES: Record<string, string> = {
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
  'nwse-resize': 'nesw-resize',
  'nesw-resize': 'nwse-resize',
};

/** Inside a mirrored layout, converts a side between stored and on-screen, both ways. */
export function mirrorSide<T extends string | undefined>(
  element: Element,
  side: T,
): T {
  if (side === undefined || !element.closest(`[${MIRROR_ATTRIBUTE}]`)) {
    return side;
  }
  return (MIRRORED_SIDES[side] ?? side) as T;
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
    unmirror: wrapInFlip,
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

const MIRRORED_TEXT_ANCHOR: Record<string, string> = {
  start: 'end',
  middle: 'middle',
  end: 'start',
};

/**
 * Box atoms get their flip on a wrapping group, so their own attributes stay
 * exactly what the editor reads, writes and persists.
 */
function wrapInFlip(element: SVGElement) {
  const flip = createElement<SVGGElement>('g', {
    [FLIP_ATTRIBUTE]: '',
    transform: boxFlip(element),
  });
  element.replaceWith(flip);
  flip.append(element);
}

function unmirrorTextBox(text: SVGElement) {
  wrapInFlip(text);
  mirrorTextAlign(text as TextElement);
  getTextEntity(text as TextElement)?.setAttribute('dir', 'auto');
}

/** Physical side a mirrored text box shows, whatever its span's `dir`. */
const MIRRORED_TEXT_SIDE: Record<TextHorizontalAlign, string> = {
  LEFT: 'right',
  CENTER: 'center',
  RIGHT: 'left',
};

/** Idempotent: `flexToAlign` reads the stored alignment back from either representation. */
function mirrorTextAlign(text: TextElement) {
  const entity = getTextEntity(text);
  if (!entity) return;
  const [horizontal] = flexToAlign(entity.style.justifyContent, undefined);
  const side = MIRRORED_TEXT_SIDE[horizontal];
  entity.style.textAlign = side;
  entity.style.justifyContent = side;
}

/**
 * Not editable, and may carry its own rotate/scale: the flip is appended as
 * its innermost transform, pivoting on the anchor with the anchor swapped, so
 * the text occupies the mirror of its box without being measured.
 */
function unmirrorSVGText(text: SVGElement) {
  const existing = text.getAttribute('transform');
  const flip = horizontalMirror(numberAttribute(text, 'x'));
  text.setAttribute('transform', existing ? `${existing} ${flip}` : flip);
  const anchor = text.getAttribute('text-anchor') || 'start';
  text.setAttribute('text-anchor', MIRRORED_TEXT_ANCHOR[anchor] ?? anchor);
  text.style.setProperty('unicode-bidi', 'plaintext');
}

function boxFlip(element: SVGElement) {
  return horizontalMirror(
    numberAttribute(element, 'x') + numberAttribute(element, 'width') / 2,
  );
}

function horizontalMirror(pivotX: number) {
  return `matrix(-1 0 0 1 ${2 * pivotX} 0)`;
}

function numberAttribute(element: SVGElement, name: string) {
  return parseFloat(element.getAttribute(name) ?? '') || 0;
}

const tagNameOf = (element: SVGElement) => element.tagName.toLowerCase();
