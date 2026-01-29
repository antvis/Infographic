import type { UpdatableInfographicOptions } from '../../options';
import type { ICommand, IStateManager } from '../types';

export class UpdateOptionsCommand implements ICommand {
  constructor(
    private options: UpdatableInfographicOptions,
    private original?: UpdatableInfographicOptions,
  ) {}

  async apply(state: IStateManager) {
    if (!this.original) {
      const prev = state.getOptions();
      this.original = {};
      (
        Object.keys(this.options) as Array<keyof UpdatableInfographicOptions>
      ).forEach((key) => {
        (this.original as any)[key] = prev[key];
      });
    }
    state.updateOptions(this.options);
  }

  async undo(state: IStateManager) {
    if (this.original) {
      state.updateOptions(this.original);
    }
  }

  serialize() {
    return {
      type: 'update-options',
      options: this.options,
      original: this.original,
    };
  }
}
