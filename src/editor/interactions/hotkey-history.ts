import type { IInteraction, InteractionInitOptions } from '../types';
import { Hotkey } from '../utils';
import { Interaction } from './base';

export class HotkeyHistory extends Interaction implements IInteraction {
  name = 'hotkey-history';

  private hotkey?: Hotkey;

  init(options: InteractionInitOptions) {
    super.init(options);

    this.hotkey = new Hotkey({
      filter: () => this.interaction.isActive(),
    });

    this.hotkey.bind('mod+z', this.handleUndo);
    this.hotkey.bind(['mod+shift+z', 'mod+y'], this.handleRedo);
  }

  destroy() {
    this.hotkey?.destroy();
  }

  private handleUndo = async (event: KeyboardEvent) => {
    event.preventDefault();
    await this.commander.undo();
  };

  private handleRedo = async (event: KeyboardEvent) => {
    event.preventDefault();
    await this.commander.redo();
  };
}
