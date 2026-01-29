import {
  BrushSelect,
  ClickSelect,
  DblClickEditText,
  DragElement,
  EditBar,
  HotkeyHistory,
  ResizeElement,
  SelectHighlight,
  SpacebarDrag,
  ZoomWheel,
} from '../editor';
import { InfographicOptions } from '../options';

const createDefaultPlugins = () => [new EditBar(), new ResizeElement()];
const createDefaultInteractions = () => [
  new SpacebarDrag(),
  new DblClickEditText(),
  new BrushSelect(),
  new ClickSelect(),
  new DragElement(),
  new HotkeyHistory(),
  new ZoomWheel(),
  new SelectHighlight(),
];

export const DEFAULT_OPTIONS: Partial<InfographicOptions> = {
  padding: 20,
  theme: 'light',
  themeConfig: {
    palette: 'antv',
  },
  get plugins() {
    return createDefaultPlugins();
  },
  get interactions() {
    return createDefaultInteractions();
  },
};
