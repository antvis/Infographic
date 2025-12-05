import type { TextElement } from '../../types';
import {
  createElement,
  getAttributes,
  isEditableText,
  setAttributes,
} from '../../utils';
import { UpdateElementCommand } from '../commands';
import type {
  IPlugin,
  PluginInitOptions,
  Selection,
  SelectionChangePayload,
} from '../types';
import { getElementViewportBounds } from '../utils';
import { Plugin } from './base';

type HandlePosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export class ResizeElement extends Plugin implements IPlugin {
  name = 'resize-element';

  private target: TextElement | null = null;

  private container?: SVGGElement;
  private outline?: SVGRectElement;
  private overlay?: SVGRectElement;
  private handles: SVGElement[] = [];

  private activeHandle: HandlePosition | null = null;
  private activePointerId: number | null = null;
  private startPointer?: DOMPoint;
  private startRect?: Rect;
  private startAttrs?: Rect;
  private lastRect?: Rect;
  private lastViewportRect?: Rect;

  init(options: PluginInitOptions) {
    super.init(options);
    const { emitter } = options;
    emitter.on('selection:change', this.handleSelectionChange);
    emitter.on('selection:geometrychange', this.handleGeometryChange);
    emitter.on('history:change', this.handleHistoryChange);
    emitter.on('deactivated', this.handleDeactivate);
  }

  destroy() {
    this.cancelDrag();
    this.removeContainer();
    const { emitter } = this;
    emitter.off('selection:change', this.handleSelectionChange);
    emitter.off('selection:geometrychange', this.handleGeometryChange);
    emitter.off('history:change', this.handleHistoryChange);
    emitter.off('deactivated', this.handleDeactivate);
  }

  private handleSelectionChange = ({ next }: SelectionChangePayload) => {
    const only = next.length === 1 ? next[0] : null;
    if (only && isEditableText(only)) {
      this.target = only as TextElement;
      this.updateHandles();
    } else {
      this.target = null;
      this.hideHandles();
      this.cancelDrag();
    }
  };

  private handleDeactivate = () => {
    this.target = null;
    this.hideHandles();
    this.cancelDrag();
  };

  private handleGeometryChange = ({
    target,
  }: {
    type: 'selection:geometrychange';
    target: Selection[number];
  }) => {
    if (!this.target || target !== this.target) return;
    const rect = this.getViewportRect(this.target);
    this.lastViewportRect = rect;
    this.updateHandles(rect);
  };

  private handleHistoryChange = () => {
    if (!this.target) return;
    const rect = this.getViewportRect(this.target);
    this.lastViewportRect = rect;
    this.updateHandles(rect);
  };

  private ensureContainer(): SVGGElement {
    if (this.container) return this.container;

    const container = createElement<SVGGElement>('g', {
      'pointer-events': 'none',
    });
    this.overlay = createElement<SVGRectElement>('rect', {
      fill: 'rgba(51, 132, 245, 0.06)',
      stroke: 'none',
      'pointer-events': 'none',
    });
    const outline = createElement<SVGRectElement>('rect', {
      fill: 'none',
      stroke: '#3384F5',
      'stroke-width': 1,
      'stroke-dasharray': '4 2',
      'pointer-events': 'none',
    });

    container.appendChild(this.overlay);
    container.appendChild(outline);
    this.outline = outline;

    const handlePositions = ResizeElement.HANDLE_POSITIONS;
    const cursors: Record<HandlePosition, string> = {
      'top-left': 'nwse-resize',
      top: 'ns-resize',
      'top-right': 'nesw-resize',
      right: 'ew-resize',
      'bottom-right': 'nwse-resize',
      bottom: 'ns-resize',
      'bottom-left': 'nesw-resize',
      left: 'ew-resize',
    };

    handlePositions.forEach((pos, index) => {
      const isEdge =
        pos === 'top' || pos === 'right' || pos === 'bottom' || pos === 'left';
      const handle = isEdge
        ? createElement<SVGLineElement>('line', {
            stroke: 'transparent',
            'stroke-width': ResizeElement.LINE_STROKE_WIDTH,
          })
        : createElement<SVGCircleElement>('circle', {
            r: ResizeElement.HANDLE_SIZE / 2,
            fill: '#3384F5',
            stroke: '#fff',
            'stroke-width': 1.5,
          });
      handle.style.cursor = cursors[pos];
      handle.style.pointerEvents = 'all';
      handle.addEventListener('pointerdown', (event) =>
        this.handlePointerDown(event as PointerEvent, pos),
      );
      handle.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
      });
      container.appendChild(handle);
      this.handles[index] = handle;
    });

    this.editor.getDocument().appendChild(container);
    this.container = container;

    return container;
  }

  private updateHandles(rect?: Rect) {
    if (!this.target) {
      this.hideHandles();
      return;
    }

    const bounds =
      rect ||
      this.getViewportRect(this.target) ||
      this.lastViewportRect ||
      null;
    if (!bounds) {
      this.hideHandles();
      return;
    }
    this.lastViewportRect = bounds;

    const container = this.ensureContainer();
    container.style.display = 'block';
    this.outline!.style.display = 'block';
    setAttributes(this.outline!, bounds);
    if (this.overlay) {
      this.overlay.style.display = 'block';
      setAttributes(this.overlay, bounds);
    }

    const points = this.getHandlePoints(bounds);
    this.handles.forEach((handle, index) => {
      const [x, y] = points[index];
      if (handle.tagName === 'circle') {
        setAttributes(handle, { cx: x, cy: y });
      } else {
        const pos = ResizeElement.HANDLE_POSITIONS[index];
        const line = this.getHandleLine(bounds, pos);
        setAttributes(handle, line);
      }
      handle.style.display = 'block';
    });
  }

  private hideHandles() {
    if (this.container) this.container.style.display = 'none';
    if (this.outline) this.outline.style.display = 'none';
    if (this.overlay) this.overlay.style.display = 'none';
    this.handles.forEach((handle) => (handle.style.display = 'none'));
  }

  private removeContainer() {
    this.container?.remove();
    this.container = undefined;
    this.outline = undefined;
    this.overlay = undefined;
    this.handles = [];
  }

  private handlePointerDown(event: PointerEvent, handle: HandlePosition) {
    if (!this.target) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    event.stopPropagation();
    event.preventDefault();

    const point = this.clientToElement(
      this.target,
      event.clientX,
      event.clientY,
    );

    this.activeHandle = handle;
    this.activePointerId = event.pointerId;
    this.startPointer = point;
    const currentRect = this.getCurrentAttributes(this.target);
    this.startRect = currentRect;
    this.startAttrs = { ...currentRect };
    this.lastRect = currentRect;
    this.lastViewportRect = this.getViewportRect(this.target);

    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  }

  private handlePointerMove = (event: PointerEvent) => {
    if (
      !this.target ||
      !this.startPointer ||
      !this.startRect ||
      !this.activeHandle ||
      (this.activePointerId !== null &&
        event.pointerId !== this.activePointerId)
    ) {
      return;
    }

    const point = this.clientToElement(
      this.target,
      event.clientX,
      event.clientY,
    );
    const dx = point.x - this.startPointer.x;
    const dy = point.y - this.startPointer.y;

    const next = this.clampRect(
      this.applyDelta(this.startRect, dx, dy, this.activeHandle),
      this.activeHandle,
    );
    this.lastRect = next;

    this.applyRect(this.target, next);
    this.lastViewportRect = this.getViewportRect(this.target);
    this.updateHandles(this.lastViewportRect);
    this.emitSelectionGeometryChange();
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (
      this.activePointerId !== null &&
      event.pointerId !== this.activePointerId
    ) {
      return;
    }

    const finalRect = this.lastRect;
    const original = this.startAttrs;
    const changed =
      finalRect &&
      this.startRect &&
      this.hasRectChanged(this.startRect, finalRect);

    this.cancelDrag();

    if (changed && this.target && finalRect && original) {
      this.commander.execute(
        new UpdateElementCommand(
          this.target,
          { attributes: finalRect },
          { attributes: original },
        ),
      );
      this.lastViewportRect = this.getViewportRect(this.target);
      this.updateHandles(this.lastViewportRect);
      this.emitSelectionGeometryChange();
    } else if (this.target) {
      const viewportRect =
        this.lastViewportRect || this.getViewportRect(this.target);
      this.updateHandles(viewportRect);
    }
  };

  private cancelDrag() {
    this.activeHandle = null;
    this.activePointerId = null;
    this.startPointer = undefined;
    this.startRect = undefined;
    this.startAttrs = undefined;
    this.lastRect = undefined;
    this.lastViewportRect = undefined;
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }

  private applyRect(target: TextElement, rect: Rect) {
    setAttributes(target, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }

  private getViewportRect(element: TextElement): Rect {
    const { x, y, width, height } = getElementViewportBounds(
      this.editor.getDocument(),
      element,
    );
    return { x, y, width, height };
  }

  private clientToElement(
    element: TextElement,
    x: number,
    y: number,
  ): DOMPoint {
    const matrix =
      element.getScreenCTM()?.inverse() ||
      this.editor.getDocument().getScreenCTM()?.inverse() ||
      new DOMMatrix();
    return new DOMPoint(x, y).matrixTransform(matrix);
  }

  private getCurrentAttributes(element: TextElement): Rect {
    const attrs = getAttributes(element, ['x', 'y', 'width', 'height'], false);
    const fallback = this.getViewportRect(element);
    const getNumber = (value: string | null, backup: number) => {
      const numeric = value !== null ? Number(value) : NaN;
      return Number.isFinite(numeric) ? numeric : backup;
    };
    return {
      x: getNumber(attrs.x, fallback.x),
      y: getNumber(attrs.y, fallback.y),
      width: getNumber(attrs.width, fallback.width),
      height: getNumber(attrs.height, fallback.height),
    };
  }

  private getHandlePoints(rect: Rect): number[][] {
    const { x, y, width, height } = rect;
    const cx = x + width / 2;
    const cy = y + height / 2;
    return [
      [x, y], // top-left
      [cx, y], // top
      [x + width, y], // top-right
      [x + width, cy], // right
      [x + width, y + height], // bottom-right
      [cx, y + height], // bottom
      [x, y + height], // bottom-left
      [x, cy], // left
    ];
  }

  private applyDelta(
    rect: Rect,
    dx: number,
    dy: number,
    handle: HandlePosition,
  ): Rect {
    let { x, y, width, height } = rect;

    switch (handle) {
      case 'top-left':
        x += dx;
        y += dy;
        width -= dx;
        height -= dy;
        break;
      case 'top':
        y += dy;
        height -= dy;
        break;
      case 'top-right':
        y += dy;
        width += dx;
        height -= dy;
        break;
      case 'right':
        width += dx;
        break;
      case 'bottom-right':
        width += dx;
        height += dy;
        break;
      case 'bottom':
        height += dy;
        break;
      case 'bottom-left':
        x += dx;
        width -= dx;
        height += dy;
        break;
      case 'left':
        x += dx;
        width -= dx;
        break;
    }

    return { x, y, width, height };
  }

  private clampRect(rect: Rect, handle: HandlePosition): Rect {
    let { x, y, width, height } = rect;

    if (width < ResizeElement.MIN_SIZE) {
      const diff = ResizeElement.MIN_SIZE - width;
      if (
        handle === 'top-left' ||
        handle === 'bottom-left' ||
        handle === 'left'
      )
        x -= diff;
      width = ResizeElement.MIN_SIZE;
    }

    if (height < ResizeElement.MIN_SIZE) {
      const diff = ResizeElement.MIN_SIZE - height;
      if (handle === 'top-left' || handle === 'top-right' || handle === 'top')
        y -= diff;
      height = ResizeElement.MIN_SIZE;
    }

    return { x, y, width, height };
  }

  private hasRectChanged(a: Rect, b: Rect) {
    return (
      Math.abs(a.x - b.x) > 0.5 ||
      Math.abs(a.y - b.y) > 0.5 ||
      Math.abs(a.width - b.width) > 0.5 ||
      Math.abs(a.height - b.height) > 0.5
    );
  }

  private emitSelectionGeometryChange() {
    if (this.target && this.lastViewportRect) {
      this.emitter.emit('selection:geometrychange', {
        type: 'selection:geometrychange',
        target: this.target,
        rect: this.lastViewportRect,
      });
    }
  }

  private getHandleLine(rect: Rect, pos: HandlePosition) {
    const { x, y, width, height } = rect;
    switch (pos) {
      case 'top':
        return { x1: x, y1: y, x2: x + width, y2: y };
      case 'right':
        return { x1: x + width, y1: y, x2: x + width, y2: y + height };
      case 'bottom':
        return { x1: x, y1: y + height, x2: x + width, y2: y + height };
      case 'left':
      default:
        return { x1: x, y1: y, x2: x, y2: y + height };
    }
  }

  private static readonly HANDLE_SIZE = 10;
  private static readonly LINE_STROKE_WIDTH = 8;
  private static readonly MIN_SIZE = 1;
  private static readonly HANDLE_POSITIONS: HandlePosition[] = [
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
  ];
}
