import { getCombinedBounds } from '../../../../jsx';
import type { Element } from '../../../../types';
import {
  getAttributes,
  injectStyleOnce,
  isIconElement,
} from '../../../../utils';
import { UpdateElementCommand } from '../../../commands';
import type { ICommandManager, Selection } from '../../../types';
import { getElementViewportBounds } from '../../../utils';
import { ELEMENT_ICONS, IconButton, Popover } from '../../components';
import type { Icon } from '../../components/icons';
import type { EditItem } from './types';

const GRID_CLASS = 'infographic-align-grid';
const GRID_COMPACT_CLASS = `${GRID_CLASS}--compact`;
const GRID_STYLE_ID = 'infographic-align-grid-style';

const GRID_STYLES = `
.${GRID_CLASS} {
  display: grid;
  grid-template-columns: repeat(4, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
}
.${GRID_COMPACT_CLASS} {
  grid-template-columns: repeat(3, 32px);
}
`;

type AlignAction =
  | 'LEFT'
  | 'H_CENTER'
  | 'RIGHT'
  | 'TOP'
  | 'V_CENTER'
  | 'BOTTOM'
  | 'H_DISTRIBUTE'
  | 'V_DISTRIBUTE';

type AlignOptions = {
  enableDistribution?: boolean;
};

type TransformParts = {
  before: string;
  after: string;
};

type AlignableItem = {
  element: Selection[number];
  bounds: DOMRect;
  mode: 'attr' | 'transform';
  startX: number;
  startY: number;
  hasX: boolean;
  hasY: boolean;
  hasDataX: boolean;
  hasDataY: boolean;
  restTransform?: TransformParts;
  originalTransform?: string | null;
  movable: boolean;
};

const ALIGN_OPTIONS: ReadonlyArray<{ icon: Icon; action: AlignAction }> = [
  { icon: ELEMENT_ICONS.alignLeft, action: 'LEFT' },
  { icon: ELEMENT_ICONS.alignH, action: 'H_CENTER' },
  { icon: ELEMENT_ICONS.alignRight, action: 'RIGHT' },
  { icon: ELEMENT_ICONS.distributeH, action: 'H_DISTRIBUTE' },
  { icon: ELEMENT_ICONS.alignTop, action: 'TOP' },
  { icon: ELEMENT_ICONS.alignV, action: 'V_CENTER' },
  { icon: ELEMENT_ICONS.alignBottom, action: 'BOTTOM' },
  { icon: ELEMENT_ICONS.distributeV, action: 'V_DISTRIBUTE' },
];

export const ElementAlign: EditItem = (
  selection,
  _attrs,
  commander: ICommandManager,
  options?: AlignOptions,
) => {
  injectStyleOnce(GRID_STYLE_ID, GRID_STYLES);
  const enableDistribution = options?.enableDistribution ?? true;

  const content = createAlignContent(
    (action) => alignSelection(selection, action, commander),
    enableDistribution,
  );

  return Popover({
    target: IconButton({ icon: ELEMENT_ICONS.align }),
    content,
    placement: 'top',
    offset: 12,
  });
};

function createAlignContent(
  onSelect: (action: AlignAction) => void,
  enableDistribution: boolean,
) {
  const content = document.createElement('div');
  content.classList.add(GRID_CLASS);
  if (!enableDistribution) content.classList.add(GRID_COMPACT_CLASS);

  const visibleOptions = enableDistribution
    ? ALIGN_OPTIONS
    : ALIGN_OPTIONS.filter(
        ({ action }) => action !== 'H_DISTRIBUTE' && action !== 'V_DISTRIBUTE',
      );

  visibleOptions.forEach(({ icon, action }) => {
    const button = IconButton({
      icon,
      onClick: () => onSelect(action),
    });
    content.appendChild(button);
  });

  return content;
}

function alignSelection(
  selection: Selection,
  action: AlignAction,
  commander: ICommandManager,
) {
  if (!selection.length) return;
  const svg = selection[0].ownerSVGElement;
  if (!svg) return;

  const items = selection
    .map((element) => createAlignableItem(element, svg))
    .filter(Boolean);

  if (!items.length) return;
  const movable = items.filter((item) => item.movable);
  if (!movable.length) return;

  const anchors = items.filter((item) => !item.movable);
  const referenceSource = anchors.length ? anchors : items;
  const reference = getCombinedBounds(
    referenceSource.map((item) => item.bounds),
  );
  const commands: UpdateElementCommand[] = [];

  switch (action) {
    case 'LEFT': {
      const target = reference.x;
      movable.forEach((item) => {
        const dx = target - item.bounds.x;
        appendCommand(commands, item, dx, 0);
      });
      break;
    }
    case 'H_CENTER': {
      const target = reference.x + reference.width / 2;
      movable.forEach((item) => {
        const dx = target - (item.bounds.x + item.bounds.width / 2);
        appendCommand(commands, item, dx, 0);
      });
      break;
    }
    case 'RIGHT': {
      const target = reference.x + reference.width;
      movable.forEach((item) => {
        const dx = target - (item.bounds.x + item.bounds.width);
        appendCommand(commands, item, dx, 0);
      });
      break;
    }
    case 'TOP': {
      const target = reference.y;
      movable.forEach((item) => {
        const dy = target - item.bounds.y;
        appendCommand(commands, item, 0, dy);
      });
      break;
    }
    case 'V_CENTER': {
      const target = reference.y + reference.height / 2;
      movable.forEach((item) => {
        const dy = target - (item.bounds.y + item.bounds.height / 2);
        appendCommand(commands, item, 0, dy);
      });
      break;
    }
    case 'BOTTOM': {
      const target = reference.y + reference.height;
      movable.forEach((item) => {
        const dy = target - (item.bounds.y + item.bounds.height);
        appendCommand(commands, item, 0, dy);
      });
      break;
    }
    case 'H_DISTRIBUTE': {
      distributeHorizontally(items, commands);
      break;
    }
    case 'V_DISTRIBUTE': {
      distributeVertically(items, commands);
      break;
    }
  }

  if (commands.length) commander.executeBatch(commands);
}

function distributeHorizontally(
  items: AlignableItem[],
  commands: UpdateElementCommand[],
) {
  if (items.length <= 2) return;
  const sorted = [...items].sort(
    (a, b) => a.bounds.x - b.bounds.x || a.bounds.y - b.bounds.y,
  );
  const anchorIndices = collectAnchorIndices(sorted);

  for (let i = 0; i < anchorIndices.length - 1; i++) {
    const startIndex = anchorIndices[i];
    const endIndex = anchorIndices[i + 1];
    const start = sorted[startIndex];
    const end = sorted[endIndex];
    const segment = sorted.slice(startIndex + 1, endIndex);
    if (!segment.length) continue;

    const space = end.bounds.x - (start.bounds.x + start.bounds.width);
    const totalWidth = segment.reduce(
      (sum, item) => sum + item.bounds.width,
      0,
    );
    const gap = (space - totalWidth) / (segment.length + 1);
    let cursor = start.bounds.x + start.bounds.width + gap;
    segment.forEach((item) => {
      const dx = cursor - item.bounds.x;
      appendCommand(commands, item, dx, 0);
      cursor += item.bounds.width + gap;
    });
  }
}

function distributeVertically(
  items: AlignableItem[],
  commands: UpdateElementCommand[],
) {
  if (items.length <= 2) return;
  const sorted = [...items].sort(
    (a, b) => a.bounds.y - b.bounds.y || a.bounds.x - b.bounds.x,
  );
  const anchorIndices = collectAnchorIndices(sorted);

  for (let i = 0; i < anchorIndices.length - 1; i++) {
    const startIndex = anchorIndices[i];
    const endIndex = anchorIndices[i + 1];
    const start = sorted[startIndex];
    const end = sorted[endIndex];
    const segment = sorted.slice(startIndex + 1, endIndex);
    if (!segment.length) continue;

    const space = end.bounds.y - (start.bounds.y + start.bounds.height);
    const totalHeight = segment.reduce(
      (sum, item) => sum + item.bounds.height,
      0,
    );
    const gap = (space - totalHeight) / (segment.length + 1);
    let cursor = start.bounds.y + start.bounds.height + gap;
    segment.forEach((item) => {
      const dy = cursor - item.bounds.y;
      appendCommand(commands, item, 0, dy);
      cursor += item.bounds.height + gap;
    });
  }
}

function collectAnchorIndices(items: AlignableItem[]) {
  const anchors = new Set<number>();
  anchors.add(0);
  anchors.add(items.length - 1);
  items.forEach((item, index) => {
    if (!item.movable) anchors.add(index);
  });
  return Array.from(anchors).sort((a, b) => a - b);
}

function appendCommand(
  commands: UpdateElementCommand[],
  item: AlignableItem,
  dx: number,
  dy: number,
) {
  const command = createUpdateCommand(item, dx, dy);
  if (command) commands.push(command);
}

function createAlignableItem(
  element: Element,
  svg: SVGSVGElement,
): AlignableItem {
  const bounds = getElementViewportBounds(svg, element);
  const movable = !isIconElement(element as SVGElement);
  const transformInfo = getTransformInfo(element as SVGElement);
  if (transformInfo) {
    return {
      element,
      bounds,
      mode: 'transform',
      startX: transformInfo.x,
      startY: transformInfo.y,
      hasX: false,
      hasY: false,
      hasDataX: false,
      hasDataY: false,
      restTransform: transformInfo.rest,
      originalTransform: transformInfo.original,
      movable,
    };
  }

  const { x, y, hasX, hasY, hasDataX, hasDataY } = getAttrInfo(element, bounds);
  return {
    element,
    bounds,
    mode: 'attr',
    startX: x,
    startY: y,
    hasX,
    hasY,
    hasDataX,
    hasDataY,
    movable,
  };
}

function createUpdateCommand(
  item: AlignableItem,
  dx: number,
  dy: number,
): UpdateElementCommand | null {
  if (!item.movable) return null;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return null;

  if (item.mode === 'attr') {
    const x = item.startX + dx;
    const y = item.startY + dy;
    const modifiedAttrs: Record<string, any> = { x, y };
    const originalAttrs: Record<string, any> = {};

    originalAttrs.x = item.hasX ? item.startX : null;
    originalAttrs.y = item.hasY ? item.startY : null;

    if (item.hasDataX) {
      modifiedAttrs['data-x'] = x;
      originalAttrs['data-x'] = item.startX;
    }
    if (item.hasDataY) {
      modifiedAttrs['data-y'] = y;
      originalAttrs['data-y'] = item.startY;
    }

    return new UpdateElementCommand(
      item.element,
      { attributes: modifiedAttrs },
      { attributes: originalAttrs },
    );
  }

  const transform = composeTransform(
    item.startX + dx,
    item.startY + dy,
    item.restTransform,
  );
  const originalTransform =
    item.originalTransform !== undefined ? item.originalTransform : null;
  return new UpdateElementCommand(
    item.element,
    { attributes: { transform } },
    { attributes: { transform: originalTransform } },
  );
}

function getAttrInfo(element: Element, bounds: DOMRect) {
  const attrs = getAttributes(
    element as SVGElement,
    ['x', 'y', 'data-x', 'data-y'],
    false,
  );
  const hasX = attrs.x !== null && attrs.x !== undefined;
  const hasY = attrs.y !== null && attrs.y !== undefined;
  const hasDataX = attrs['data-x'] !== null && attrs['data-x'] !== undefined;
  const hasDataY = attrs['data-y'] !== null && attrs['data-y'] !== undefined;

  const parseNumber = (value: string | null | undefined, fallback: number) => {
    const num = value !== null && value !== undefined ? Number(value) : NaN;
    return Number.isFinite(num) ? num : fallback;
  };

  const xFromAttr = parseNumber(attrs.x, NaN);
  const yFromAttr = parseNumber(attrs.y, NaN);
  const xFromData = parseNumber(attrs['data-x'], NaN);
  const yFromData = parseNumber(attrs['data-y'], NaN);
  const x = Number.isFinite(xFromAttr)
    ? xFromAttr
    : Number.isFinite(xFromData)
      ? xFromData
      : bounds.x;
  const y = Number.isFinite(yFromAttr)
    ? yFromAttr
    : Number.isFinite(yFromData)
      ? yFromData
      : bounds.y;

  return { x, y, hasX, hasY, hasDataX, hasDataY };
}

function getTransformInfo(element: SVGElement) {
  const transform = element.getAttribute('transform');
  if (transform === null) return null;

  const match = transform.match(
    /translate\(\s*([-\d.]+)(?:[ ,]\s*([-\d.]+))?\s*\)/i,
  );
  if (!match) {
    const before = transform.trim();
    return {
      x: 0,
      y: 0,
      rest: { before, after: '' },
      original: transform,
    };
  }

  const x = Number(match[1]) || 0;
  const y = match[2] !== undefined ? Number(match[2]) || 0 : 0;
  const start = match.index ?? 0;
  const before = transform.slice(0, start).trim();
  const after = transform.slice(start + match[0].length).trim();
  const rest = { before, after };
  return { x, y, rest, original: transform };
}

function composeTransform(x: number, y: number, rest?: TransformParts) {
  const translate = `translate(${x}, ${y})`;
  const parts = [rest?.before, translate, rest?.after].filter(
    (part) => part && part.length,
  );
  return parts.join(' ');
}
