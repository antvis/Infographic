import type PickrType from '@simonwep/pickr';
import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';

import { injectStyleOnce } from '../../../../utils';

export type ColorPickerProps = {
  value?: string;
  swatches?: string[];
  onChange?: (value: string) => void;
};

export type ColorPickerHandle = {
  setValue: (value?: string) => void;
  destroy: () => void;
};

const COLOR_PICKER_CLASS = 'infographic-color-picker';
const COLOR_PICKER_APP_CLASS = `${COLOR_PICKER_CLASS}__app`;
const COLOR_PICKER_STYLE_ID = 'infographic-color-picker-style';
const DEFAULT_COLOR = '#1f1f1f';
const DEFAULT_SWATCHES = [
  '#000000',
  '#1f1f1f',
  '#434343',
  '#595959',
  '#8c8c8c',
  '#bfbfbf',
  '#d9d9d9',
  '#f0f0f0',
  '#ffffff',
  '#1677ff',
  '#2f54eb',
  '#91caff',
  '#13c2c2',
  '#36cfc9',
  '#52c41a',
  '#73d13d',
  '#fadb14',
  '#ffd666',
  '#fa8c16',
  '#fa541c',
  '#f5222d',
  '#ff7875',
  '#eb2f96',
  '#ffadd2',
  '#722ed1',
  '#9254de',
  'rgba(0, 0, 0, 0.65)',
  'rgba(255, 255, 255, 0.85)',
];

export function ColorPicker(
  props: ColorPickerProps,
): HTMLDivElement & ColorPickerHandle {
  ensureColorPickerStyles();

  const container = document.createElement('div');
  container.classList.add(COLOR_PICKER_CLASS);

  const mount = document.createElement('div');
  container.appendChild(mount);

  const swatches = props.swatches?.length ? props.swatches : DEFAULT_SWATCHES;
  let currentColor = normalizeColor(props.value);

  const pickr = Pickr.create({
    el: mount,
    container,
    theme: 'nano',
    appClass: COLOR_PICKER_APP_CLASS,
    default: currentColor ?? DEFAULT_COLOR,
    swatches,
    lockOpacity: false,
    defaultRepresentation: 'HEXA',
    inline: true,
    showAlways: true,
    useAsButton: true,
    components: {
      preview: false,
      opacity: true,
      hue: false,
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        clear: false,
        save: false,
        cancel: false,
        hsla: false,
        hsva: false,
        cmyk: false,
      },
    },
  });

  const handleColorChange = (color: PickrType.HSVaColor | null) => {
    const formatted = formatColor(color);
    if (!formatted || formatted === currentColor) return;
    currentColor = formatted;
    props.onChange?.(formatted);
  };

  pickr.on('change', handleColorChange);
  pickr.on('swatchselect', handleColorChange);

  const api: ColorPickerHandle = {
    setValue: (value) => {
      const next = normalizeColor(value);
      currentColor = next;
      pickr.setColor(next ?? DEFAULT_COLOR, true);
    },
    destroy: () => {
      pickr.destroyAndRemove();
      container.remove();
    },
  };

  return Object.assign(container, api);
}

function normalizeColor(color?: string | null) {
  if (!color) return undefined;
  const trimmed = color.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function formatColor(color: PickrType.HSVaColor | null) {
  if (!color) return undefined;
  const rgba = color.toRGBA();
  const alpha = rgba[3];
  if (typeof alpha === 'number' && alpha < 1) {
    return rgba.toString(0);
  }
  return color.toHEXA().toString();
}

function ensureColorPickerStyles() {
  injectStyleOnce(
    COLOR_PICKER_STYLE_ID,
    `
.${COLOR_PICKER_CLASS} .pcr-app {
  width: 100%;
}
.${COLOR_PICKER_CLASS} .pcr-button {
  display: none;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} {
  position: static;
  opacity: 1;
  visibility: visible;
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-selection {
  display: none !important;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-swatches {
  grid-template-columns: repeat(auto-fit, 26px);
  gap: 2px;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-swatches > button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-swatches > button::before,
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-swatches > button::after {
  border-radius: 50%;
  inset: 0;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-swatches > button::after {
  border: none;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-interaction {
  font-size: 14px;
  padding: 4px 10px 10px;
  justify-content: space-between;
}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-interaction .pcr-result {

}
.${COLOR_PICKER_CLASS} .${COLOR_PICKER_APP_CLASS} .pcr-interaction .pcr-type {
    flex: 1;
}
`,
  );
}
