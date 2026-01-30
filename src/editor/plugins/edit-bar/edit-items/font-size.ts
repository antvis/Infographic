import type { TextAttributes } from '../../../../types';
import { injectStyleOnce } from '../../../../utils';
import { UpdateElementCommand } from '../../../commands';
import { IconButton, Popover, TEXT_ICONS } from '../../components';
import type { Button } from '../../components/button';
import type { Icon } from '../../components/icons';
import type { EditItem } from './types';

const FONT_SIZE_CLASS = 'infographic-font-size-grid';
const FONT_SIZE_STYLE_ID = 'infographic-font-size-grid-style';

const FONT_SIZE_OPTIONS = [
  { label: 'XS', value: 12 },
  { label: 'S', value: 14 },
  { label: 'M', value: 16 },
  { label: 'L', value: 20 },
  { label: 'XL', value: 24 },
] as const;

const FONT_SIZE_STYLES = `
.${FONT_SIZE_CLASS} {
  display: grid;
  grid-template-columns: repeat(5, 32px);
  grid-auto-rows: 32px;
  gap: 2px;
}
`;

export const FontSize: EditItem<TextAttributes> = (
  selection,
  attrs,
  commander,
) => {
  injectStyleOnce(FONT_SIZE_STYLE_ID, FONT_SIZE_STYLES);

  const button = IconButton({ icon: TEXT_ICONS.fontSize });
  const currentSize = normalizeFontSize(attrs['font-size']);
  const content = createFontSizeContent(currentSize, (size) => {
    commander.executeBatch(
      selection.map(
        (text) =>
          new UpdateElementCommand(text, {
            attributes: { 'font-size': size },
          }),
      ),
    );
  });

  return Popover({
    target: button,
    content,
    placement: 'top',
    offset: 12,
  });
};

function createFontSizeContent(
  defaultSize: number,
  onSizeChange: (size: number) => void,
) {
  const content = document.createElement('div');
  content.classList.add(FONT_SIZE_CLASS);

  let selected = defaultSize;
  const buttons: Record<string, Button> = {};

  const updateAllButtons = () => {
    Object.entries(buttons).forEach(([value, button]) => {
      const isActive = Number(value) === selected;
      button.setActivate(isActive);
    });
  };

  FONT_SIZE_OPTIONS.forEach(({ label, value }) => {
    const button = IconButton({
      icon: createLabelIcon(label),
      onClick: () => {
        if (selected === value) return;
        selected = value;
        updateAllButtons();
        onSizeChange(value);
      },
      activate: value === selected,
    });

    buttons[String(value)] = button;
    content.appendChild(button);
  });

  return content;
}

function createLabelIcon(label: string): Icon {
  return () => {
    const size = '1.2em';
    const span = document.createElement('span');
    span.textContent = label;
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.justifyContent = 'center';
    span.style.width = size;
    span.style.height = size;
    span.style.fontSize = '12px';
    return span;
  };
}

function normalizeFontSize(size: TextAttributes['font-size']) {
  const DEFAULT_SIZE = 12;
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    const num = parseFloat(size);
    return Number.isFinite(num) ? num : DEFAULT_SIZE;
  }
  return DEFAULT_SIZE;
}
