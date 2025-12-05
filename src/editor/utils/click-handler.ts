interface ClickHandlerOptions {
  delay?: number;
  dragThreshold?: number;
}

export class ClickHandler {
  private element: SVGSVGElement;
  private delay: number;
  private dragThreshold: number;
  private clickTimer: number | null = null;
  private singleClickCallback: ((e: MouseEvent) => void) | null = null;
  private doubleClickCallback: ((e: MouseEvent) => void) | null = null;
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private skipClick = false;
  private dragged = false;

  constructor(element: SVGSVGElement, options: ClickHandlerOptions = {}) {
    this.element = element;
    this.delay = options.delay || 300;
    this.dragThreshold = options.dragThreshold ?? 4;
    this.init();
  }

  private init(): void {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener(
      'dblclick',
      this.handleDoubleClick.bind(this),
    );
    this.element.addEventListener('pointerdown', this.handlePointerDown);
  }

  private handleClick(e: MouseEvent): void {
    if (this.skipClick) {
      this.skipClick = false;
      return;
    }
    if (this.clickTimer) clearTimeout(this.clickTimer);

    this.clickTimer = window.setTimeout(() => {
      this.singleClickCallback?.(e);
    }, this.delay);
  }

  private handleDoubleClick(e: MouseEvent): void {
    if (this.skipClick) {
      this.skipClick = false;
      return;
    }
    if (this.clickTimer) clearTimeout(this.clickTimer);
    this.doubleClickCallback?.(e);
  }

  private handlePointerDown = (event: PointerEvent) => {
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.dragged = false;
    this.skipClick = false;
    window.addEventListener('pointermove', this.handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerup', this.handlePointerUp, {
      passive: true,
    });
    window.addEventListener('pointercancel', this.handlePointerUp, {
      passive: true,
    });
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (this.pointerId === null || event.pointerId !== this.pointerId) return;
    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    if (Math.hypot(dx, dy) > this.dragThreshold) {
      this.skipClick = true;
      this.dragged = true;
    }
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (this.pointerId !== null && event.pointerId === this.pointerId) {
      this.pointerId = null;
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
      window.removeEventListener('pointercancel', this.handlePointerUp);
      // Only allow click through if we did not detect a drag.
      if (!this.dragged) this.skipClick = false;
      this.dragged = false;
    }
  };

  onClick(callback: (e: MouseEvent) => void): this {
    this.singleClickCallback = callback;
    return this;
  }

  onDoubleClick(callback: (e: MouseEvent) => void): this {
    this.doubleClickCallback = callback;
    return this;
  }

  destroy(): void {
    if (this.clickTimer) clearTimeout(this.clickTimer);
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('dblclick', this.handleDoubleClick);
    this.element.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }
}
