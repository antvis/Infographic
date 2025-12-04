import {
  ClickSelect,
  DblClickEditText,
  EditBar,
  ResizeElement,
  SelectHighlight,
} from '../editor';
import { InfographicOptions } from '../options';

export const DEFAULT_OPTIONS: Partial<InfographicOptions> = {
  plugins: [new EditBar(), new ResizeElement()],
  interactions: [
    new DblClickEditText(),
    new ClickSelect(),
    new SelectHighlight(),
  ],
};
