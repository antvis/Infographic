import type { TextAttributes } from '../../../../types';
import { hasColor, injectStyleOnce } from '../../../../utils';
import { UpdateElementCommand } from '../../../commands';
import { ColorPicker, Popover } from '../../components';
import type { EditItem } from './types';

const FONT_COLOR_BUTTON_CLASS = 'infographic-font-color-btn';
const FONT_COLOR_STYLE_ID = 'infographic-font-color-style';
const DEFAULT_COLOR = '#1f1f1f';

export const FontColor: EditItem<TextAttributes> = (
  selection,
  attrs,
  commander,
) => {
  ensureFontColorStyles();

  const color = normalizeColor(attrs.fill);
  const isMixed = attrs.fill === undefined && selection.length > 1;

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add(FONT_COLOR_BUTTON_CLASS);
  setButtonColor(button, color ?? DEFAULT_COLOR, isMixed);

  const picker = ColorPicker({
    value: color ?? DEFAULT_COLOR,
    onChange: (nextColor) => {
      setButtonColor(button, nextColor, false);
      commander.executeBatch(
        selection.map(
          (text) =>
            new UpdateElementCommand(text, {
              attributes: { fill: nextColor },
            }),
        ),
      );
    },
  });

  return Popover({
    target: button,
    content: picker,
    placement: ['top', 'bottom'],
    offset: 12,
    trigger: 'hover',
    closeOnOutsideClick: true,
    open: false,
    padding: 0,
  });
};

function normalizeColor(fill?: TextAttributes['fill']) {
  if (!fill) return undefined;
  return hasColor(fill) ? fill : undefined;
}

function setButtonColor(
  button: HTMLButtonElement,
  color: string,
  mixed: boolean,
) {
  button.style.setProperty('--infographic-font-color', color);
  if (mixed) button.setAttribute('data-mixed', 'true');
  else button.removeAttribute('data-mixed');
}

function ensureFontColorStyles() {
  injectStyleOnce(
    FONT_COLOR_STYLE_ID,
    `
.${FONT_COLOR_BUTTON_CLASS} {
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.${FONT_COLOR_BUTTON_CLASS}::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--infographic-font-color, ${DEFAULT_COLOR});
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
}
.${FONT_COLOR_BUTTON_CLASS}[data-mixed="true"]::after {
  background: repeating-linear-gradient(
    45deg,
    #d9d9d9 0,
    #d9d9d9 6px,
    #f5f5f5 6px,
    #f5f5f5 12px
  );
}
`,
  );
}
