import type {
  TextAttributes,
  TextHorizontalAlign,
  TextVerticalAlign,
} from '../../../../types';
import { injectStyleOnce } from '../../../../utils';
import { BatchCommand, UpdateElementCommand } from '../../../commands';
import {
  AlignBottom,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignMiddle,
  AlignRight,
  AlignTop,
  Button,
  IconButton,
  Popover,
} from '../components';
import type { EditItem } from './types';

// 常量定义
const GRID_CLASS = 'infographic-font-align-grid';
const GRID_STYLE_ID = 'infographic-font-align-grid-style';

const HORIZONTAL_ALIGN_OPTIONS = [
  { icon: AlignLeft, align: 'LEFT' },
  { icon: AlignCenter, align: 'CENTER' },
  { icon: AlignRight, align: 'RIGHT' },
] as const;

const VERTICAL_ALIGN_OPTIONS = [
  { icon: AlignTop, align: 'TOP' },
  { icon: AlignMiddle, align: 'MIDDLE' },
  { icon: AlignBottom, align: 'BOTTOM' },
] as const;

const GRID_STYLES = `
.${GRID_CLASS} {
  display: grid;
  grid-template-columns: repeat(3, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
}
`;

// 类型定义
type AlignState = {
  horizontal: TextHorizontalAlign | undefined;
  vertical: TextVerticalAlign | undefined;
};

type AlignOption<T> = {
  icon: any;
  align: T;
};

export const FontAlign: EditItem<TextAttributes> = (
  selection,
  attrs,
  commander,
) => {
  injectStyleOnce(GRID_STYLE_ID, GRID_STYLES);

  const state: AlignState = {
    horizontal: attrs['data-horizontal-align'],
    vertical: attrs['data-vertical-align'],
  };

  const button = IconButton({ icon: AlignJustify });

  const content = createAlignContent(state, (align) => {
    const attributes: Partial<TextAttributes> = {};
    if (align.horizontal)
      attributes['data-horizontal-align'] = align.horizontal;
    if (align.vertical) attributes['data-vertical-align'] = align.vertical;

    if (!Object.keys(attributes).length) return;

    const command = new BatchCommand(
      selection.map(
        (text) =>
          new UpdateElementCommand(text, {
            attributes,
          }),
      ),
    );
    commander.execute(command);
  });

  return Popover({
    target: button,
    content,
    placement: 'top',
    offset: 12,
  });
};

function createAlignContent(
  state: AlignState,
  onAlignChange: (align: AlignState) => void,
) {
  const content = document.createElement('div');
  content.classList.add(GRID_CLASS);

  const buttons: Record<string, Button> = {};

  const updateAllButtons = () => {
    Object.entries(buttons).forEach(([align, button]) => {
      const isActive = align === state.horizontal || align === state.vertical;
      button.setActivate(isActive);
    });
  };

  const createButtons = <T extends string>(
    options: ReadonlyArray<AlignOption<T>>,
    stateKey: keyof AlignState,
  ) => {
    options.forEach(({ icon, align }) => {
      const button = IconButton({
        icon,
        onClick: () => {
          if (state[stateKey] === align) return;

          Object.assign(state, { [stateKey]: align });

          updateAllButtons();
          onAlignChange({ ...state });
        },
        activate: align === state[stateKey],
      });
      buttons[align] = button;
      content.appendChild(button);
    });
  };

  createButtons(HORIZONTAL_ALIGN_OPTIONS, 'horizontal');
  createButtons(VERTICAL_ALIGN_OPTIONS, 'vertical');

  return content;
}
