import {
  ClickSelect,
  DblClickEditText,
  EditBar,
  SelectHighlight,
} from '../editor';
import { InfographicOptions } from '../options';

export const DEFAULT_OPTIONS: Partial<InfographicOptions> = {
  plugins: [new EditBar()],
  interactions: [
    new DblClickEditText(),
    new ClickSelect(),
    new SelectHighlight(),
  ],
};
