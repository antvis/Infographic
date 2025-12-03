import { isEditingText } from '../../utils';
import type {
  ICommandManager,
  IEditor,
  IInteractionManager,
  Interaction,
} from '../types';
import { ClickHandler, getEventTarget } from '../utils';
export class ClickSelect implements Interaction {
  name = 'click-select';

  private clickHandler?: ClickHandler;

  init(
    editor: IEditor,
    command: ICommandManager,
    interaction: IInteractionManager,
  ) {
    this.clickHandler = new ClickHandler(editor.getDocument());

    const handleSelect = (event: MouseEvent) => {
      if (!interaction.isActive()) return;
      interaction.executeExclusiveInteraction(this, async () => {
        const target = getEventTarget(event.target as SVGElement);
        if (isEditingText(target)) return;

        if (this.shiftKey) {
          // 多选
          if (target) {
            if (interaction.isSelected(target)) {
              interaction.select([target], 'remove');
            } else {
              interaction.select([target], 'add');
            }
          }
        } else {
          // 单选
          if (target) interaction.select([target], 'replace');
          else interaction.clearSelection();
        }
      });
    };

    this.clickHandler.onClick(handleSelect);

    document.addEventListener('keydown', this.onShiftKeyDown);
    document.addEventListener('keyup', this.onShiftKeyUp);
  }

  destroy() {
    this.clickHandler?.destroy();
    document.removeEventListener('keydown', this.onShiftKeyDown);
    document.removeEventListener('keyup', this.onShiftKeyUp);
  }

  private shiftKey = false;

  private onShiftKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.shiftKey = true;
    }
  };

  private onShiftKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Shift') {
      this.shiftKey = false;
    }
  };
}
