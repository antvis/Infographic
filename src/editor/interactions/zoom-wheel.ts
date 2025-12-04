import { clamp } from 'lodash-es';
import type { Padding } from '../../types';
import { parsePadding } from '../../utils';
import { UpdateOptionsCommand } from '../commands';
import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';

const MIN_VIEWBOX_SIZE = 1;
const MIN_PADDING = -5000;
const MAX_PADDING = 5000;

export class ZoomWheel extends Interaction implements IInteraction {
  name = 'zoom-wheel';

  private wheelListener = (event: WheelEvent) => {
    if (!this.interaction.isActive()) return;
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();

    const factor = event.deltaY > 0 ? 1.1 : 0.9;
    const current = this.state.getOptions();
    const currentPadding = current.padding ?? 0;
    const parsed = parsePadding(currentPadding);
    const svg = this.editor.getDocument();
    const bbox = svg.getBBox();

    const scaled = parsed.map((value) => {
      const base = value === 0 ? 1 : value;
      return clamp(base * factor, MIN_PADDING, MAX_PADDING);
    });

    const [top, right, bottom, left] = scaled;
    const newWidth = bbox.width + left + right;
    const newHeight = bbox.height + top + bottom;

    if (newWidth <= MIN_VIEWBOX_SIZE || newHeight <= MIN_VIEWBOX_SIZE) return;

    const command = new UpdateOptionsCommand({
      padding: scaled as Padding,
    });
    void this.commander.execute(command);
  };

  init(options: InteractionInitOptions) {
    super.init(options);
    document.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  destroy() {
    document.removeEventListener('wheel', this.wheelListener);
  }
}
