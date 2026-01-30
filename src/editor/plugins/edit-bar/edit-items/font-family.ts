import { getFonts } from '../../../../renderer';
import type { TextAttributes } from '../../../../types';
import {
  decodeFontFamily,
  encodeFontFamily,
  injectStyleOnce,
} from '../../../../utils';
import { UpdateElementCommand } from '../../../commands';
import { IconButton, Popover, TEXT_ICONS } from '../../components';
import type { EditItem } from './types';

const FONT_LIST_CLASS = 'infographic-font-family-list';
const FONT_OPTION_CLASS = `${FONT_LIST_CLASS}__option`;
const FONT_LIST_STYLE_ID = 'infographic-font-family-list-style';
const DEFAULT_FONT_LABEL = '默认';

export const FontFamily: EditItem<TextAttributes> = (
  selection,
  attrs,
  commander,
) => {
  ensureFontFamilyListStyle();

  const fonts = getFonts();
  const current = normalizeFontFamily(attrs['font-family']);

  const options = fonts.map((font) => ({
    label: font.name || font.fontFamily,
    value: font.fontFamily,
  }));
  if (
    !options.some((option) => normalizeFontFamily(option.value) === current)
  ) {
    options.unshift({
      label: DEFAULT_FONT_LABEL,
      value: current,
    });
  }

  let selected = current;
  const content = createFontList(options, selected, (value) => {
    if (selected === value) return;
    selected = value;
    commander.executeBatch(
      selection.map(
        (text) =>
          new UpdateElementCommand(text, {
            attributes: { 'font-family': decodeFontFamily(value) },
          }),
      ),
    );
  });

  const button = IconButton({ icon: TEXT_ICONS.fontFamily });

  const popover = Popover({
    target: button,
    content,
    placement: ['top', 'bottom'],
    offset: 12,
    trigger: 'hover',
    closeOnOutsideClick: true,
    open: false,
    padding: 0,
  });

  return popover;
};

function createFontList(
  options: { label: string; value: string }[],
  selected: string | undefined,
  onChange: (value: string) => void,
) {
  const content = document.createElement('div');
  content.classList.add(FONT_LIST_CLASS);

  const buttons: Record<string, HTMLButtonElement> = {};

  const updateAllButtons = (active?: string) => {
    Object.entries(buttons).forEach(([value, button]) => {
      if (value === active) button.setAttribute('data-activate', 'true');
      else button.removeAttribute('data-activate');
    });
  };

  options.forEach(({ label, value }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(FONT_OPTION_CLASS);
    button.textContent = label;
    button.style.fontFamily = value;
    if (value === selected) button.setAttribute('data-activate', 'true');
    button.addEventListener('click', () => {
      if (selected === value) return;
      selected = value;
      updateAllButtons(selected);
      onChange(value);
    });
    buttons[value] = button;
    content.appendChild(button);
  });

  return content;
}

function normalizeFontFamily(font: TextAttributes['font-family']) {
  if (!font) return '';
  if (Array.isArray(font)) return encodeFontFamily(font.join(', '));
  return encodeFontFamily(String(font));
}

function ensureFontFamilyListStyle() {
  injectStyleOnce(
    FONT_LIST_STYLE_ID,
    `
.${FONT_LIST_CLASS} {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
  min-width: 180px;
  max-height: 220px;
  overflow-y: auto;
}
.${FONT_OPTION_CLASS} {
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #000000d9;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.${FONT_OPTION_CLASS}:hover {
  background: #f5f5f5;
}
.${FONT_OPTION_CLASS}[data-activate="true"] {
  background: #e6f4ff;
  color: #0958d9;
}
`,
  );
}
