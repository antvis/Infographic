import { inRange } from 'lodash-es';
import {
  calculateZoomedViewBox,
  getViewBox,
  viewBoxToString,
} from '../../utils/viewbox';
import { UpdateOptionsCommand } from '../commands';
import type { IInteraction, InteractionInitOptions } from '../types';
import { clientToViewport } from '../utils';
import { Interaction } from './base';

const MIN_VIEWBOX_SIZE = 20;
const MAX_VIEWBOX_SIZE = 2000;
const ZOOM_FACTOR = 1.1;

export class ZoomWheel extends Interaction implements IInteraction {
  name = 'zoom-wheel';

  private initialViewBox: string | null = null;

  private handleKeyUp = (event: KeyboardEvent) => {
    const isZoomModifierHeld = event.ctrlKey || event.metaKey || event.shiftKey;

    if (!isZoomModifierHeld && this.initialViewBox) {
      const currentViewBox = viewBoxToString(
        getViewBox(this.editor.getDocument()),
      );

      if (currentViewBox !== this.initialViewBox) {
        const command = new UpdateOptionsCommand(
          { viewBox: currentViewBox },
          { viewBox: this.initialViewBox },
        );
        void this.commander.execute(command);
      }

      this.initialViewBox = null;
      document.removeEventListener('keyup', this.handleKeyUp);
    }
  };

  private wheelListener = (event: WheelEvent) => {
    if (!this.shouldZoom(event)) return;
    event.preventDefault();

    // Standard Zoom: Scroll Up (deltaY < 0) = Zoom In
    const isZoomIn = event.deltaY < 0;
    const factor = isZoomIn ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;

    const svg = this.editor.getDocument();
    const viewBox = getViewBox(svg);
    const { width, height } = viewBox;

    const newWidth = width * factor;
    const newHeight = height * factor;

    if (
      !inRange(newWidth, MIN_VIEWBOX_SIZE, MAX_VIEWBOX_SIZE) ||
      !inRange(newHeight, MIN_VIEWBOX_SIZE, MAX_VIEWBOX_SIZE)
    )
      return;

    if (this.initialViewBox === null) {
      this.initialViewBox = viewBoxToString(viewBox);
      document.addEventListener('keyup', this.handleKeyUp);
    }

    const pivot =
      (event.ctrlKey || event.metaKey) && !event.shiftKey
        ? this.getMousePoint(svg, event)
        : this.getCenterPoint(viewBox);

    const newViewBox = calculateZoomedViewBox(viewBox, factor, pivot);

    this.state.updateOptions({
      viewBox: viewBoxToString(newViewBox),
    });
  };

  private getMousePoint = (svg: SVGSVGElement, event: WheelEvent) => {
    return clientToViewport(svg, event.clientX, event.clientY);
  };

  private getCenterPoint = (viewBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;
    return { x: centerX, y: centerY };
  };

  private shouldZoom = (event: WheelEvent) => {
    if (!this.interaction.isActive()) return false;
    if (event.deltaY === 0) return false;

    const isMouseZoom = event.ctrlKey || event.metaKey;
    const isCenterZoom = event.shiftKey;
    if (isMouseZoom && isCenterZoom) return false;

    return isMouseZoom || isCenterZoom;
  };

  init(options: InteractionInitOptions) {
    super.init(options);
    document.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  destroy() {
    document.removeEventListener('wheel', this.wheelListener);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
