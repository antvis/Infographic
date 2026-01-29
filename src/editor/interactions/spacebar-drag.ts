import { getViewBox, viewBoxToString } from '@antv/infographic/utils';
import { UpdateOptionsCommand } from '../commands';
import { IInteraction, InteractionInitOptions } from '../types';
import { clientToViewport, isTextSelectionTarget } from '../utils';
import { Interaction } from './base';

type CursorType = 'grab' | 'grabbing' | 'default';

export class SpacebarDrag extends Interaction implements IInteraction {
  name = 'spacebar-drag';

  private isSpacePressed = false;

  private pointerId?: number;
  private startPoint?: DOMPoint;

  private document!: SVGSVGElement;

  private startViewBoxString?: string;

  private completeInteraction?: () => void;

  init(options: InteractionInitOptions): void {
    super.init(options);
    this.document = this.editor.getDocument();

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('blur', this.handleBlur);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    this.document.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);

    window.removeEventListener('blur', this.handleBlur);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (isTextSelectionTarget(event.target)) return;
    if (event.code !== 'Space') return;
    event.preventDefault();
    event.stopPropagation();
    if (!this.interaction.isActive()) return;
    if (this.isSpacePressed) return;
    this.interaction.executeExclusiveInteraction(
      this,
      async () =>
        new Promise<void>((resolve) => {
          this.completeInteraction = resolve;

          this.isSpacePressed = true;
          this.setCursor('grab');

          // Must use capture phase to preemptively intercept events
          // before other interactions (like click-select) can process them.
          this.document.addEventListener(
            'pointerdown',
            this.handlePointerDown,
            { capture: true },
          );
          window.addEventListener('keyup', this.handleKeyUp);
        }),
    );
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const svg = this.document;
    const viewBox = getViewBox(svg);
    this.startPoint = clientToViewport(svg, event.clientX, event.clientY);
    this.pointerId = event.pointerId;

    this.startViewBoxString = viewBoxToString(viewBox);

    this.setCursor('grabbing');

    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
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
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.code !== 'Space') return;
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

    this.isSpacePressed = false;

    this.setCursor('default');

    this.startPoint = undefined;
    this.pointerId = undefined;

    window.removeEventListener('keyup', this.handleKeyUp);

    this.document.removeEventListener('pointerdown', this.handlePointerDown, {
      capture: true,
    });
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);

    this.completeInteraction?.();
    this.completeInteraction = undefined;
  };

  private setCursor = (behavior: CursorType) => {
    document.body.style.cursor = behavior;
  };

  private handleBlur = () => {
    this.stopDrag();
  };
}
