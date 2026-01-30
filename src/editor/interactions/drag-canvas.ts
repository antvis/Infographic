import { getViewBox, viewBoxToString } from '../../utils';
import { UpdateOptionsCommand } from '../commands';
import { IInteraction, InteractionInitOptions, KeyCode } from '../types';
import { clientToViewport, isTextSelectionTarget } from '../utils';
import { Interaction } from './base';

type CursorType = 'grab' | 'grabbing' | 'default';
export interface DragCanvasOptions {
  trigger?: KeyCode[];
}

export class DragCanvas extends Interaction implements IInteraction {
  name = 'drag-canvas';

  /**
   * 触发交互的按键代码。
   * 参考标准的 KeyboardEvent.code 值：
   * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
   * @default ['Space']
   */
  public trigger: KeyCode[] = ['Space'];

  constructor(options?: DragCanvasOptions) {
    super();
    if (options?.trigger) {
      this.trigger = options.trigger;
    }
  }

  private isTriggerPressed = false;

  private pointerId?: number;
  private startPoint?: DOMPoint;

  private document!: SVGSVGElement;

  private startViewBoxString?: string;

  private completeInteraction?: () => void;

  // 防止组件快捷键侵入性过强
  private isHovering = false;

  init(options: InteractionInitOptions): void {
    super.init(options);
    this.document = this.editor.getDocument();

    this.document.addEventListener('mouseenter', this.onMouseEnter);
    this.document.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('blur', this.handleBlur);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    this.document.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);

    window.removeEventListener('blur', this.handleBlur);
    this.document.removeEventListener('mouseenter', this.onMouseEnter);
    this.document.removeEventListener('mouseleave', this.onMouseLeave);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.interaction.isActive()) return;
    if (isTextSelectionTarget(event.target)) return;

    // 增加焦点的判断，防止对空格的preventDefault侵入性过强
    const target = event.target as Element;
    const isBody =
      target === document.body || target === document.documentElement;
    const isEditor = target === this.document || this.document.contains(target);
    if (!isBody && !isEditor) return;

    if (!this.trigger.includes(event.code)) return;
    if (!this.isHovering && !this.isTriggerPressed) return;
    event.preventDefault();
    event.stopPropagation();
    this.interaction.executeExclusiveInteraction(
      this,
      async () =>
        new Promise<void>((resolve) => {
          this.completeInteraction = resolve;

          this.isTriggerPressed = true;
          const viewBox = getViewBox(this.document);

          this.startViewBoxString = viewBoxToString(viewBox);
          this.setCursor('grab');

          this.document.addEventListener('pointerdown', this.handlePointerDown);
          window.addEventListener('keyup', this.handleKeyUp);
        }),
    );
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const svg = this.document;
    this.startPoint = clientToViewport(svg, event.clientX, event.clientY);
    this.pointerId = event.pointerId;

    this.setCursor('grabbing');

    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  };

  private handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId || !this.startPoint) return;
    event.preventDefault();
    event.stopPropagation();

    const svg = this.document;
    const current = clientToViewport(svg, event.clientX, event.clientY);
    const dx = current.x - this.startPoint.x;
    const dy = current.y - this.startPoint.y;

    const viewBox = getViewBox(svg);

    const { x, y, width, height } = viewBox;

    const newX = x - dx;
    const newY = y - dy;

    this.state.updateOptions({
      viewBox: viewBoxToString({ x: newX, y: newY, width, height }),
    });
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return;

    this.startPoint = undefined;
    this.pointerId = undefined;
    this.setCursor('grab');
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (!this.trigger.includes(event.code)) return;
    this.stopDrag();
  };

  private stopDrag = () => {
    if (this.startViewBoxString) {
      const svg = this.document;
      const viewBox = getViewBox(svg);
      const currentViewBoxString = viewBoxToString(viewBox);

      if (this.startViewBoxString !== currentViewBoxString) {
        const command = new UpdateOptionsCommand(
          { viewBox: currentViewBoxString },
          { viewBox: this.startViewBoxString },
        );
        void this.commander.execute(command);
      }
    }
    this.startViewBoxString = undefined;

    this.isTriggerPressed = false;

    this.setCursor('default');

    this.startPoint = undefined;
    this.pointerId = undefined;

    window.removeEventListener('keyup', this.handleKeyUp);

    this.document.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);

    this.completeInteraction?.();
    this.completeInteraction = undefined;
  };

  private setCursor = (behavior: CursorType) => {
    document.body.style.cursor = behavior;
  };

  private handleBlur = () => {
    this.stopDrag();
  };

  private onMouseEnter = () => {
    this.isHovering = true;
  };
  private onMouseLeave = () => {
    this.isHovering = false;
  };
}
