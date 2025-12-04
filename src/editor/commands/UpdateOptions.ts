import type { ParsedInfographicOptions } from '../../options';
import type { ICommand, IStateManager } from '../types';

export class UpdateOptionsCommand implements ICommand {
  constructor(
    private options: Partial<ParsedInfographicOptions>,
    private original?: ParsedInfographicOptions,
  ) {}

  async apply(state: IStateManager) {
    const prev = state.getOptions();
    if (!this.original) {
      this.original = prev;
    }
    state.updateOptions({ ...prev, ...this.options });
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
