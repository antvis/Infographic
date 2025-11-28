import { CommandManager } from '../command';
import type { Editor } from '../editor';
import type { IInteractionManager } from '../interaction';

export interface Interaction {
  name: string;
  init(
    editor: Editor,
    command: CommandManager,
    interaction: IInteractionManager,
  ): void;
  destroy(): void;
}
