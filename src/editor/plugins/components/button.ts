import { injectStyleOnce } from '../../../utils';
import type { Icon } from './icons';

export type Button = HTMLButtonElement & IconButtonHandle;

export interface IconButtonProps {
  icon: Icon;
  onClick?: () => void;
  activate?: boolean;
}

export interface IconButtonHandle {
  activate: boolean;
  setActivate: (activate: boolean) => void;
}

export const IconButton = ({
  icon,
  onClick,
  activate = false,
}: IconButtonProps): Button => {
  ensureIconButtonStyle();

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add(ICON_BUTTON_CLASS);
  if (activate) button.setAttribute('data-activate', 'true');
  if (onClick) button.addEventListener('click', onClick);

  const iconElement = icon();
  button.appendChild(iconElement);

  const setActivate = (next: boolean) => {
    if (next) button.setAttribute('data-activate', 'true');
    else button.removeAttribute('data-activate');
  };

  return Object.assign(button, {
    setActivate: setActivate.bind(button),
    activate,
  });
};

const ICON_BUTTON_CLASS = 'infographic-edit-bar-icon-btn';
const ICON_BUTTON_STYLE_ID = 'infographic-edit-bar-icon-btn-style';

function ensureIconButtonStyle() {
  injectStyleOnce(
    ICON_BUTTON_STYLE_ID,
    `
.${ICON_BUTTON_CLASS} {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 12px;
  color: #000000d9;
  border: none;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  transition: color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.${ICON_BUTTON_CLASS}:hover {
  background-color: #f5f5f5;
}
.${ICON_BUTTON_CLASS}:active {
  background-color: #d9d9d9;
}
.${ICON_BUTTON_CLASS}[data-activate="true"] {
  background-color: #d9d9d9;
}
`,
  );
}
