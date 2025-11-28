import type { Bounds } from '../../jsx/types';
import { getCombinedBounds } from '../../jsx/utils/bounds';
import { createElement, getViewBox, setAttributes } from '../../utils';
import { CommandManager } from '../command';
import type { IEditor } from '../editor';
import type { IInteractionManager } from '../interaction';
import type { Interaction, Selection } from '../types';

type SelectionChangePayload = {
  previous: Selection;
  next: Selection;
  added: Selection;
  removed: Selection;
  mode: 'replace' | 'add' | 'remove' | 'toggle';
};

export class SelectHighlight implements Interaction {
  name = 'select-highlight';

  private editor!: IEditor;
  private interaction!: IInteractionManager;

  private highlightMasks: SVGRectElement[] = [];
  private combinedBoundsMask?: SVGRectElement;

  init(
    editor: IEditor,
    _command: CommandManager,
    interaction: IInteractionManager,
  ) {
    this.editor = editor;
    this.interaction = interaction;

    editor.on('selection:change', this.handleSelectionChanged);
    this.highlightSelection(interaction.getSelection());
  }

  destroy() {
    this.clearMasks();
    this.editor.off('selection:change', this.handleSelectionChanged);
  }

  private handleSelectionChanged = ({ next }: SelectionChangePayload) => {
    this.highlightSelection(next);
  };

  private highlightSelection(selection: Selection) {
    this.drawElementMasks(selection);
    this.drawCombinedBoundsMask(selection);
  }

  private drawElementMasks(selection: Selection) {
    let index = 0;

    for (; index < selection.length; index++) {
      const bounds = this.getElementViewportBounds(selection[index]);
      const attrs = {
        ...bounds,
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
      selection.map((element) => this.getElementViewportBounds(element)),
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

  private getElementViewportBounds(element: Selection[number]): Bounds {
    const svg = this.editor.getDocument();
    const elementRect = element.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const viewBox = getViewBox(svg);

    const viewWidth = viewBox.width || svgRect.width || 1;
    const viewHeight = viewBox.height || svgRect.height || 1;
    const scaleX = svgRect.width ? viewWidth / svgRect.width : 1;
    const scaleY = svgRect.height ? viewHeight / svgRect.height : 1;

    return {
      x: (elementRect.left - svgRect.left) * scaleX + viewBox.x,
      y: (elementRect.top - svgRect.top) * scaleY + viewBox.y,
      width: elementRect.width * scaleX,
      height: elementRect.height * scaleY,
    };
  }

  private clearMasks() {
    this.highlightMasks.forEach((mask) => mask.remove());
    this.highlightMasks = [];
    this.combinedBoundsMask?.remove();
    this.combinedBoundsMask = undefined;
  }
}
