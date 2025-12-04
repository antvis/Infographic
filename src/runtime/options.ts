import {
  ClickSelect,
  DblClickEditText,
  EditBar,
  ResizeElement,
  SelectHighlight,
} from '../editor';
import { InfographicOptions } from '../options';

const createDefaultPlugins = () => [new EditBar(), new ResizeElement()];
const createDefaultInteractions = () => [
  new DblClickEditText(),
  new ClickSelect(),
  new SelectHighlight(),
];

export const DEFAULT_OPTIONS: Partial<InfographicOptions> = {
  get plugins() {
    return createDefaultPlugins();
  },
  get interactions() {
    return createDefaultInteractions();
  },
};
