import {
  createElement,
  isEditableText,
  isIconElement,
  setAttributes,
} from '../../utils';
import type { IInteraction, InteractionInitOptions, Selection } from '../types';
import {
  clientToViewport,
  getElementViewportBounds,
  getEventTarget,
} from '../utils';
import { Interaction } from './base';

type Rect = { x: number; y: number; width: number; height: number };

export class BrushSelect extends Interaction implements IInteraction {
  name = 'brush-select';

  private brush?: SVGRectElement;
  private startPoint?: DOMPoint;
  private pointerId?: number;
  private shiftKey = false;
  private completeInteraction?: () => void;
  private dragging = false;
  private dragThreshold = 4;

  init(options: InteractionInitOptions) {
    super.init(options);
    this.editor.getDocument().addEventListener('pointerdown', this.handleStart);
  }

  destroy() {
    this.clearBrush();
    this.editor
      .getDocument()
      .removeEventListener('pointerdown', this.handleStart);
    window.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerup', this.handleEnd);
  }

  private handleStart = (event: PointerEvent) => {
    if (!this.interaction.isActive()) return;
    if (event.button !== 0) return;
    if (this.isTextSelectionTarget(event.target)) return;
    if (this.hasElementAtStart(event.target)) return;

    this.interaction.executeExclusiveInteraction(
      this,
      async () =>
        new Promise<void>((resolve) => {
          this.completeInteraction = resolve;

          const svg = this.editor.getDocument();
          this.startPoint = clientToViewport(svg, event.clientX, event.clientY);
          this.pointerId = event.pointerId;
          this.shiftKey = event.shiftKey;
          this.dragging = false;

          window.addEventListener('pointermove', this.handleMove);
          window.addEventListener('pointerup', this.handleEnd);
        }),
    );
  };

  private handleMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId || !this.startPoint) return;

    const svg = this.editor.getDocument();
    const current = clientToViewport(svg, event.clientX, event.clientY);
    const dx = current.x - this.startPoint.x;
    const dy = current.y - this.startPoint.y;

    if (!this.dragging) {
      if (Math.hypot(dx, dy) < this.dragThreshold) return;
      this.dragging = true;
      this.ensureBrush();
      this.updateBrush(this.startPoint, current);
    }

    event.preventDefault();
    event.stopPropagation();
    this.updateBrush(this.startPoint, current);
  };

  private handleEnd = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId || !this.startPoint) return;

    window.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerup', this.handleEnd);

    let rect: Rect | null = null;
    if (this.dragging) {
      event.preventDefault();
      event.stopPropagation();
      const svg = this.editor.getDocument();
      const endPoint = clientToViewport(svg, event.clientX, event.clientY);
      rect = this.updateBrush(this.startPoint, endPoint);
      this.clearBrush();
    }

    this.pointerId = undefined;
    this.startPoint = undefined;
    this.dragging = false;
    const withShift = this.shiftKey;
    this.shiftKey = false;

    if (!rect) {
      this.completeInteraction?.();
      this.completeInteraction = undefined;
      return;
    }

    const selection = this.collectSelection(rect);
    this.completeInteraction?.();
    this.completeInteraction = undefined;

    if (selection.length === 0) {
      if (!withShift) this.interaction.clearSelection();
      return;
    }

    const mode: 'replace' | 'add' = withShift ? 'add' : 'replace';
    this.interaction.select(selection, mode);
  };

  private ensureBrush() {
    if (this.brush) return this.brush;
    this.brush = this.interaction.appendTransientElement(
      createElement<SVGRectElement>('rect', {
        fill: 'rgba(51, 132, 245, 0.08)',
        stroke: '#3384F5',
        'stroke-dasharray': '4 2',
        'stroke-width': 1,
        'pointer-events': 'none',
      }),
    );
    return this.brush;
  }

  private updateBrush(start: DOMPoint, current: DOMPoint) {
    if (!this.brush) return null;

    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const width = Math.abs(start.x - current.x);
    const height = Math.abs(start.y - current.y);

    setAttributes(this.brush, { x, y, width, height });
    return { x, y, width, height } as Rect;
  }

  private clearBrush() {
    this.brush?.remove();
    this.brush = undefined;
  }

  private collectSelection(rect: Rect): Selection {
    const svg = this.editor.getDocument();

    const candidates = Array.from(
      svg.querySelectorAll<SVGGraphicsElement | SVGForeignObjectElement>(
        '[data-element-type]',
      ),
    );

    const intersects = (a: Rect, b: Rect) => {
      const ax2 = a.x + a.width;
      const ay2 = a.y + a.height;
      const bx2 = b.x + b.width;
      const by2 = b.y + b.height;
      return !(ax2 < b.x || bx2 < a.x || ay2 < b.y || by2 < a.y);
    };

    return candidates.reduce<Selection>((selection, node) => {
      const element = node as unknown as Selection[number];
      if (!this.isSelectable(element)) return selection;

      const bounds = getElementViewportBounds(svg, element);
      const targetRect: Rect = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };

      if (intersects(rect, targetRect)) {
        selection.push(element);
      }
      return selection;
    }, []);
  }

  private isSelectable(element: Selection[number]) {
    return isEditableText(element) || isIconElement(element);
  }

  private hasElementAtStart(target: EventTarget | null) {
    if (!(target instanceof Element)) return false;
    if (getEventTarget(target as unknown as SVGElement)) return true;
    return Boolean(target.closest?.('[data-element-type]'));
  }

  private isTextSelectionTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable) return true;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea';
  }
}
