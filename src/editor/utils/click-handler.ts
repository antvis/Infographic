interface ClickHandlerOptions {
  delay?: number;
}

export class ClickHandler {
  private element: SVGSVGElement;
  private delay: number;
  private clickTimer: number | null = null;
  private singleClickCallback: ((e: MouseEvent) => void) | null = null;
  private doubleClickCallback: ((e: MouseEvent) => void) | null = null;

  constructor(element: SVGSVGElement, options: ClickHandlerOptions = {}) {
    this.element = element;
    this.delay = options.delay || 300;
    this.init();
  }

  private init(): void {
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener(
      'dblclick',
      this.handleDoubleClick.bind(this),
    );
  }

  private handleClick(e: MouseEvent): void {
    if (this.clickTimer) clearTimeout(this.clickTimer);

    this.clickTimer = window.setTimeout(() => {
      this.singleClickCallback?.(e);
    }, this.delay);
  }

  private handleDoubleClick(e: MouseEvent): void {
    if (this.clickTimer) clearTimeout(this.clickTimer);
    this.doubleClickCallback?.(e);
  }

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
  }
}
