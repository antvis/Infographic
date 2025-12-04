import type { IEventEmitter } from '../../types';
import type {
  ICommandManager,
  IEditor,
  IInteraction,
  IInteractionManager,
  IStateManager,
  InteractionInitOptions,
} from '../types';

export abstract class Interaction implements IInteraction {
  abstract name: string;

  protected emitter!: IEventEmitter;
  protected editor!: IEditor;
  protected commander!: ICommandManager;
  protected state!: IStateManager;
  protected interaction!: IInteractionManager;

  init(options: InteractionInitOptions) {
    Object.assign(this, options);
  }

  abstract destroy(): void;
}
