import type { Bounds } from '../../jsx/types/bounds';
import { getCombinedBounds } from '../../jsx/utils/bounds';
import type { Element } from '../../types';
import {
  createElement,
  getAttributes,
  isEditableText,
  isEditingText,
  setAttributes,
} from '../../utils';
import { UpdateElementCommand } from '../commands';
import type { IInteraction, InteractionInitOptions, Selection } from '../types';
import {
  clientToViewport,
  getElementViewportBounds,
  getEventTarget,
} from '../utils';
import { Interaction } from './base';

type DragMode = 'attr' | 'transform';

type DragItem = {
  element: Selection[number];
  mode: DragMode;
  startX: number;
  startY: number;
  hasX: boolean;
  hasY: boolean;
  hasDataX: boolean;
  hasDataY: boolean;
  restTransform?: string;
  originalTransform?: string | null;
};

type SnapOffset = { offset: number; at: number };
type SnapResult = {
  dx: number;
  dy: number;
  snapX?: SnapOffset;
  snapY?: SnapOffset;
};
type GuideCandidates = { vertical: number[]; horizontal: number[] };

export class DragElement extends Interaction implements IInteraction {
  name = 'drag-element';

  private pointerId?: number;
  private startPoint?: DOMPoint;
  private startTarget?: Selection[number];
  private selectionForDrag: Selection = [];
  private willReplaceSelection = false;
  private exclusiveStarted = false;
  private dragItems: DragItem[] = [];
  private dragging = false;
  private dragThreshold = 4;
  private completeInteraction?: () => void;
  private guideCandidates?: GuideCandidates;
  private startBounds?: Bounds;
  private guideVertical?: SVGLineElement;
  private guideHorizontal?: SVGLineElement;

  init(options: InteractionInitOptions) {
    super.init(options);
    this.editor.getDocument().addEventListener('pointerdown', this.handleStart);
  }

  destroy() {
    this.detachPointerListeners();
    this.editor
      .getDocument()
      .removeEventListener('pointerdown', this.handleStart);
  }

  private handleStart = (event: PointerEvent) => {
    if (!this.interaction.isActive()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = getEventTarget(event.target as SVGElement);
    if (!target) return;
    if (isEditingText(target)) return;

    const svg = this.editor.getDocument();
    this.pointerId = event.pointerId;
    this.startPoint = clientToViewport(svg, event.clientX, event.clientY);
    this.dragging = false;
    this.startTarget = target;
    const isSelected = this.interaction.isSelected(target);
    this.selectionForDrag = isSelected
      ? this.interaction.getSelection()
      : [target];
    this.willReplaceSelection = !isSelected;
    this.exclusiveStarted = false;
    this.startBounds = this.getSelectionBounds(this.selectionForDrag);
    this.guideCandidates = this.collectGuideCandidates(this.selectionForDrag);

    window.addEventListener('pointermove', this.handleMove);
    window.addEventListener('pointerup', this.handleEnd);
    window.addEventListener('pointercancel', this.handleEnd);
  };

  private handleMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId || !this.startPoint) return;

    const svg = this.editor.getDocument();
    const current = clientToViewport(svg, event.clientX, event.clientY);
    const dx = current.x - this.startPoint.x;
    const dy = current.y - this.startPoint.y;

    if (!this.dragging) {
      if (Math.hypot(dx, dy) < this.dragThreshold) return;
      if (!this.startDrag()) {
        this.reset();
        return;
      }
      this.dragging = true;
    }

    const altKey = event.altKey;
    const snap: SnapResult = !altKey
      ? this.getSnappedDelta(dx, dy)
      : { dx, dy };

    event.preventDefault();
    event.stopPropagation();
    this.updateGuides(snap);
    this.applyTranslation(snap.dx, snap.dy);
    this.emitGeometryChange();
  };

  private handleEnd = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId || !this.startPoint) return;

    this.detachPointerListeners();

    const svg = this.editor.getDocument();
    const endPoint = clientToViewport(svg, event.clientX, event.clientY);
    const dx = endPoint.x - this.startPoint.x;
    const dy = endPoint.y - this.startPoint.y;
    const moved = this.dragging || Math.hypot(dx, dy) >= this.dragThreshold;

    if (moved && this.dragItems.length && this.exclusiveStarted) {
      event.preventDefault();
      event.stopPropagation();
      const snap: SnapResult = event.altKey
        ? { dx, dy }
        : this.getSnappedDelta(dx, dy);
      this.updateGuides(snap);
      this.applyTranslation(snap.dx, snap.dy);
      this.commitTranslation(snap.dx, snap.dy);
      this.emitGeometryChange();
    }

    this.reset();
  };

  private startDrag() {
    if (this.exclusiveStarted) return true;
    if (!this.startTarget) return false;

    if (this.willReplaceSelection) {
      this.interaction.select([this.startTarget], 'replace');
    }

    this.dragItems = this.selectionForDrag
      .filter((element) => isEditableText(element))
      .map((element) => this.createDragItem(element))
      .filter(Boolean) as DragItem[];

    if (this.dragItems.length === 0) return false;

    let started = false;
    this.interaction.executeExclusiveInteraction(
      this,
      async () =>
        new Promise<void>((resolve) => {
          this.completeInteraction = resolve;
          started = true;
        }),
    );
    this.exclusiveStarted = started;
    return started;
  }

  private applyTranslation(dx: number, dy: number) {
    this.dragItems.forEach((item) => {
      if (item.mode === 'attr') {
        const x = item.startX + dx;
        const y = item.startY + dy;
        const attrs: Record<string, any> = { x, y };
        if (item.hasDataX) attrs['data-x'] = x;
        if (item.hasDataY) attrs['data-y'] = y;
        setAttributes(item.element, attrs);
      } else {
        const transform = this.composeTransform(
          item.startX + dx,
          item.startY + dy,
          item.restTransform,
        );
        setAttributes(item.element, { transform });
      }
    });
  }

  private commitTranslation(dx: number, dy: number) {
    if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return;

    const commands = this.dragItems.map((item) => {
      if (item.mode === 'attr') {
        const x = item.startX + dx;
        const y = item.startY + dy;
        const modifiedAttrs: Record<string, any> = { x, y };
        const originalAttrs: Record<string, any> = {};

        if (item.hasX) {
          originalAttrs.x = item.startX;
        } else {
          originalAttrs.x = null;
        }

        if (item.hasY) {
          originalAttrs.y = item.startY;
        } else {
          originalAttrs.y = null;
        }

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

      const transform = this.composeTransform(
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
    });

    if (commands.length) {
      this.commander.executeBatch(commands);
    }
  }

  private createDragItem(element: Selection[number]): DragItem | null {
    const transformInfo = this.getTransformInfo(element as SVGElement);
    if (transformInfo) {
      return {
        element,
        mode: 'transform',
        startX: transformInfo.x,
        startY: transformInfo.y,
        hasX: false,
        hasY: false,
        hasDataX: false,
        hasDataY: false,
        restTransform: transformInfo.rest,
        originalTransform: transformInfo.original,
      };
    }

    const { x, y, hasX, hasY, hasDataX, hasDataY } = this.getAttrInfo(element);
    return {
      element,
      mode: 'attr',
      startX: x,
      startY: y,
      hasX,
      hasY,
      hasDataX,
      hasDataY,
    };
  }

  private getAttrInfo(element: Element) {
    const svg = this.editor.getDocument();
    const { x: bx, y: by } = getElementViewportBounds(svg, element);
    const attrs = getAttributes(element, ['x', 'y', 'data-x', 'data-y'], false);
    const hasX = attrs.x !== null && attrs.x !== undefined;
    const hasY = attrs.y !== null && attrs.y !== undefined;
    const hasDataX = attrs['data-x'] !== null && attrs['data-x'] !== undefined;
    const hasDataY = attrs['data-y'] !== null && attrs['data-y'] !== undefined;

    const parseNumber = (
      value: string | null | undefined,
      fallback: number,
    ) => {
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
        : bx;
    const y = Number.isFinite(yFromAttr)
      ? yFromAttr
      : Number.isFinite(yFromData)
        ? yFromData
        : by;

    return { x, y, hasX, hasY, hasDataX, hasDataY };
  }

  private getTransformInfo(element: SVGElement) {
    const transform = element.getAttribute('transform');
    if (transform === null) return null;

    const match = transform.match(
      /translate\(\s*([-\d.]+)(?:[ ,]\s*([-\d.]+))?\s*\)/i,
    );
    if (!match) {
      return { x: 0, y: 0, rest: transform, original: transform };
    }

    const x = Number(match[1]) || 0;
    const y = match[2] !== undefined ? Number(match[2]) || 0 : 0;
    const rest = transform.replace(match[0], '').trim();
    return { x, y, rest, original: transform };
  }

  private composeTransform(x: number, y: number, rest?: string) {
    const translate = `translate(${x}, ${y})`;
    return rest && rest.length ? `${translate} ${rest}` : translate;
  }

  private emitGeometryChange() {
    const target = this.dragItems[0]?.element;
    if (!target) return;
    const rect = getElementViewportBounds(this.editor.getDocument(), target);
    this.emitter.emit('selection:geometrychange', {
      type: 'selection:geometrychange',
      target,
      rect,
    });
  }

  private detachPointerListeners() {
    window.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerup', this.handleEnd);
    window.removeEventListener('pointercancel', this.handleEnd);
  }

  private reset() {
    this.detachPointerListeners();
    this.clearGuides();
    this.pointerId = undefined;
    this.startPoint = undefined;
    this.dragItems = [];
    this.startTarget = undefined;
    this.selectionForDrag = [];
    this.willReplaceSelection = false;
    this.exclusiveStarted = false;
    this.dragging = false;
    this.startBounds = undefined;
    this.guideCandidates = undefined;
    this.completeInteraction?.();
    this.completeInteraction = undefined;
  }

  private getSelectionBounds(
    selection: Selection,
  ): { x: number; y: number; width: number; height: number } | undefined {
    if (!selection.length) return undefined;
    const svg = this.editor.getDocument();
    const rects = selection.map((el) => getElementViewportBounds(svg, el));
    return getCombinedBounds(rects);
  }

  private collectGuideCandidates(selection: Selection) {
    const svg = this.editor.getDocument();
    const skip = new Set(selection);
    const elements = Array.from(
      svg.querySelectorAll<SVGGraphicsElement | SVGForeignObjectElement>(
        '[data-element-type]',
      ),
    ).filter((el) => !skip.has(el as unknown as Selection[number]));

    const vertical: number[] = [];
    const horizontal: number[] = [];
    elements.forEach((el) => {
      const { x, y, width, height } = getElementViewportBounds(
        svg,
        el as unknown as Selection[number],
      );
      vertical.push(x, x + width / 2, x + width);
      horizontal.push(y, y + height / 2, y + height);
    });
    return { vertical, horizontal };
  }

  private getSnappedDelta(dx: number, dy: number): SnapResult {
    if (!this.startBounds || !this.guideCandidates) return { dx, dy };

    const moving = {
      x: this.startBounds.x + dx,
      y: this.startBounds.y + dy,
      width: this.startBounds.width,
      height: this.startBounds.height,
    };

    const snapX = this.getSnapOffset(
      [moving.x, moving.x + moving.width / 2, moving.x + moving.width],
      this.guideCandidates.vertical,
    );
    const snapY = this.getSnapOffset(
      [moving.y, moving.y + moving.height / 2, moving.y + moving.height],
      this.guideCandidates.horizontal,
    );

    return {
      dx: dx + (snapX?.offset || 0),
      dy: dy + (snapY?.offset || 0),
      snapX,
      snapY,
    };
  }

  private getSnapOffset(
    points: number[],
    candidates: number[],
    threshold = 5,
  ): SnapOffset | undefined {
    let best: SnapOffset | null = null;
    points.forEach((point) => {
      candidates.forEach((c) => {
        const delta = c - point;
        if (Math.abs(delta) <= threshold) {
          if (!best || Math.abs(delta) < Math.abs(best.offset)) {
            best = { offset: delta, at: c };
          }
        }
      });
    });
    return best || undefined;
  }

  private ensureGuideLine(
    orientation: 'vertical' | 'horizontal',
  ): SVGLineElement {
    const existing =
      orientation === 'vertical' ? this.guideVertical : this.guideHorizontal;
    if (existing) return existing;
    const line = this.interaction.appendTransientElement(
      createElement<SVGLineElement>('line', {
        stroke: '#FF7A45',
        'stroke-width': 1,
        'stroke-dasharray': '4 4',
        'pointer-events': 'none',
        visibility: 'hidden',
      }),
    );
    if (orientation === 'vertical') this.guideVertical = line;
    else this.guideHorizontal = line;
    return line;
  }

  private updateGuides(snap: SnapResult) {
    const svg = this.editor.getDocument();
    const { width, height } = svg.viewBox.baseVal;
    if (snap.snapX) {
      const line = this.ensureGuideLine('vertical');
      setAttributes(line, {
        x1: snap.snapX.at,
        y1: 0,
        x2: snap.snapX.at,
        y2: height,
        visibility: 'visible',
      });
    } else if (this.guideVertical) {
      this.guideVertical.setAttribute('visibility', 'hidden');
    }

    if (snap.snapY) {
      const line = this.ensureGuideLine('horizontal');
      setAttributes(line, {
        x1: 0,
        y1: snap.snapY.at,
        x2: width,
        y2: snap.snapY.at,
        visibility: 'visible',
      });
    } else if (this.guideHorizontal) {
      this.guideHorizontal.setAttribute('visibility', 'hidden');
    }
  }

  private clearGuides() {
    this.guideVertical?.remove();
    this.guideHorizontal?.remove();
    this.guideVertical = undefined;
    this.guideHorizontal = undefined;
  }
}
