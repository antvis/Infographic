import {
  BrushSelect,
  ClickSelect,
  DblClickEditText,
  DragElement,
  EditBar,
  HotkeyHistory,
  ResizeElement,
  SelectHighlight,
  ZoomWheel,
} from '../editor';
import { InfographicOptions } from '../options';

const createDefaultPlugins = () => [new EditBar(), new ResizeElement()];
const createDefaultInteractions = () => [
  new DblClickEditText(),
  new BrushSelect(),
  new ClickSelect(),
  new DragElement(),
  new HotkeyHistory(),
  new ZoomWheel(),
  new SelectHighlight(),
];

export const DEFAULT_OPTIONS: Partial<InfographicOptions> = {
  padding: 0,
  get plugins() {
    return createDefaultPlugins();
  },
  get interactions() {
    return createDefaultInteractions();
  },
};
