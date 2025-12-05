import { getCombinedBounds } from '../../jsx/utils/bounds';
import { createElement, isEditableText, setAttributes } from '../../utils';
import type { IInteraction, InteractionInitOptions, Selection } from '../types';
import { getElementViewportBounds } from '../utils';
import { Interaction } from './base';

type SelectionChangePayload = {
  previous: Selection;
  next: Selection;
  added: Selection;
  removed: Selection;
  mode: 'replace' | 'add' | 'remove' | 'toggle';
};

type SelectionGeometryChangePayload = {
  type: 'selection:geometrychange';
  target: Selection[number];
  rect: { x: number; y: number; width: number; height: number };
};

export class SelectHighlight extends Interaction implements IInteraction {
  name = 'select-highlight';

  private highlightMasks: SVGRectElement[] = [];
  private combinedBoundsMask?: SVGRectElement;

  init(options: InteractionInitOptions) {
    super.init(options);
    const { emitter } = options;
    emitter.on('selection:change', this.handleSelectionChanged);
    emitter.on('selection:geometrychange', this.handleGeometryChanged);
    emitter.on('history:change', this.handleHistoryChanged);
    this.highlightSelection(this.interaction.getSelection());
  }

  destroy() {
    this.clearMasks();
    const { emitter } = this;
    emitter.off('selection:change', this.handleSelectionChanged);
    emitter.off('selection:geometrychange', this.handleGeometryChanged);
    emitter.off('history:change', this.handleHistoryChanged);
  }

  private handleSelectionChanged = ({ next }: SelectionChangePayload) => {
    this.highlightSelection(next);
  };

  private handleGeometryChanged = ({
    target,
  }: SelectionGeometryChangePayload) => {
    if (this.interaction.isSelected(target)) {
      this.highlightSelection(this.interaction.getSelection());
    }
  };

  private handleHistoryChanged = () => {
    this.highlightSelection(this.interaction.getSelection());
  };

  private highlightSelection(selection: Selection) {
    if (selection.length === 1 && isEditableText(selection[0])) {
      this.clearMasks();
      return;
    }

    this.drawElementMasks(selection);
    this.drawCombinedBoundsMask(selection);
  }

  private drawElementMasks(selection: Selection) {
    let index = 0;
    for (; index < selection.length; index++) {
      const { x, y, width, height } = getElementViewportBounds(
        this.editor.getDocument(),
        selection[index],
      );
      const attrs = {
        x,
        y,
        width,
        height,
        fill: 'none',
        stroke: '#3384F5',
        'stroke-width': 1,
        'pointer-events': 'none',
      };

      const mask = this.highlightMasks[index];
      if (mask) {
        setAttributes(mask, attrs);
      } else {
        this.highlightMasks[index] = this.interaction.appendTransientElement(
          createElement<SVGRectElement>('rect', attrs),
        );
      }
    }

    for (; index < this.highlightMasks.length; index++) {
      this.highlightMasks[index].remove();
    }
    this.highlightMasks = this.highlightMasks.slice(0, selection.length);
  }

  private drawCombinedBoundsMask(selection: Selection) {
    if (selection.length < 2) {
      this.combinedBoundsMask?.remove();
      this.combinedBoundsMask = undefined;
      return;
    }

    const bounds = getCombinedBounds(
      selection.map((element) =>
        getElementViewportBounds(this.editor.getDocument(), element),
      ),
    );

    const attrs = {
      ...bounds,
      fill: 'none',
      stroke: '#3384F5',
      'stroke-width': 2,
      'pointer-events': 'none',
    };

    if (this.combinedBoundsMask) {
      setAttributes(this.combinedBoundsMask, attrs);
    } else {
      this.combinedBoundsMask = this.interaction.appendTransientElement(
        createElement<SVGRectElement>('rect', attrs),
      );
    }
  }

  private clearMasks() {
    this.highlightMasks.forEach((mask) => mask.remove());
    this.highlightMasks = [];
    this.combinedBoundsMask?.remove();
    this.combinedBoundsMask = undefined;
  }
}
