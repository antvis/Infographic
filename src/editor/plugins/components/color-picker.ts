import { parse } from 'culori';

import { injectStyleOnce } from '../../../utils';

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
const COLOR_PICKER_SWATCHES_CLASS = `${COLOR_PICKER_CLASS}__swatches`;
const COLOR_PICKER_SWATCH_CLASS = `${COLOR_PICKER_CLASS}__swatch`;
const COLOR_PICKER_CONTROLS_CLASS = `${COLOR_PICKER_CLASS}__controls`;
const COLOR_PICKER_INPUT_CLASS = `${COLOR_PICKER_CLASS}__input`;
const COLOR_PICKER_FORMAT_CLASS = `${COLOR_PICKER_CLASS}__format`;
const COLOR_PICKER_SWITCH_CLASS = `${COLOR_PICKER_CLASS}__format-switch`;
const COLOR_PICKER_SWITCH_KNOB_CLASS = `${COLOR_PICKER_CLASS}__format-switch-knob`;
const COLOR_PICKER_SWITCH_LABEL_CLASS = `${COLOR_PICKER_CLASS}__format-switch-label`;
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

type ColorFormat = 'hexa' | 'rgba';
type RgbaColor = { r: number; g: number; b: number; a: number };

export function ColorPicker(
  props: ColorPickerProps,
): HTMLDivElement & ColorPickerHandle {
  if (typeof document === 'undefined') {
    throw new Error('ColorPicker can only be used in the browser.');
  }

  ensureColorPickerStyles();

  const container = document.createElement('div');
  container.classList.add(COLOR_PICKER_CLASS);

  const swatchContainer = document.createElement('div');
  swatchContainer.classList.add(COLOR_PICKER_SWATCHES_CLASS);
  container.appendChild(swatchContainer);

  const controls = document.createElement('div');
  controls.classList.add(COLOR_PICKER_CONTROLS_CLASS);
  container.appendChild(controls);

  const input = document.createElement('input');
  input.type = 'text';
  input.spellcheck = false;
  input.classList.add(COLOR_PICKER_INPUT_CLASS);
  controls.appendChild(input);

  const formatToggle = document.createElement('div');
  formatToggle.classList.add(COLOR_PICKER_FORMAT_CLASS);
  controls.appendChild(formatToggle);

  const formatSwitch = document.createElement('button');
  formatSwitch.type = 'button';
  formatSwitch.classList.add(COLOR_PICKER_SWITCH_CLASS);
  formatSwitch.appendChild(createSwitchLabel('HEXA'));
  const switchKnob = document.createElement('span');
  switchKnob.classList.add(COLOR_PICKER_SWITCH_KNOB_CLASS);
  formatSwitch.appendChild(switchKnob);
  formatSwitch.appendChild(createSwitchLabel('RGBA'));
  formatToggle.appendChild(formatSwitch);

  let format: ColorFormat = 'hexa';
  let color: RgbaColor = parseColor(props.value) ??
    parseColor(DEFAULT_COLOR) ?? {
      r: 31,
      g: 31,
      b: 31,
      a: 1,
    };

  const swatchButtons: HTMLButtonElement[] = [];

  const swatches = props.swatches?.length ? props.swatches : DEFAULT_SWATCHES;
  swatches.forEach((value) => {
    const parsed = parseColor(value);
    if (!parsed) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add(COLOR_PICKER_SWATCH_CLASS);
    button.style.setProperty('--swatch-color', formatColor(parsed, 'rgba'));
    button.dataset.colorKey = colorKey(parsed);
    button.addEventListener('click', () => {
      setColor(parsed);
    });
    swatchContainer.appendChild(button);
    swatchButtons.push(button);
  });

  formatSwitch.addEventListener('click', () =>
    setFormat(format === 'hexa' ? 'rgba' : 'hexa', true),
  );

  input.addEventListener('change', handleInput);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleInput();
  });

  syncUI();

  const api: ColorPickerHandle = {
    setValue: (value) => {
      const parsed = parseColor(value);
      if (!parsed) {
        input.setAttribute('data-invalid', 'true');
        return;
      }
      input.removeAttribute('data-invalid');
      setColor(parsed, false);
    },
    destroy: () => {
      container.remove();
    },
  };

  return Object.assign(container, api);

  function handleInput() {
    const parsed = parseColor(input.value);
    if (!parsed) {
      input.setAttribute('data-invalid', 'true');
      return;
    }
    input.removeAttribute('data-invalid');
    setColor(parsed);
  }

  function setFormat(next: ColorFormat, emitChange: boolean) {
    if (format === next) return;
    format = next;
    syncUI();
    if (emitChange) {
      props.onChange?.(formatColor(color, format));
    }
  }

  function setColor(next: RgbaColor, emitChange = true) {
    if (isSameColor(color, next)) {
      syncUI();
      return;
    }
    color = next;
    syncUI();
    if (emitChange) {
      props.onChange?.(formatColor(color, format));
    }
  }

  function syncUI() {
    input.value = formatColor(color, format);
    updateSwatches();
    updateFormatButtons();
  }

  function updateSwatches() {
    const key = colorKey(color);
    swatchButtons.forEach((btn) => {
      if (btn.dataset.colorKey === key) {
        btn.setAttribute('data-active', 'true');
      } else {
        btn.removeAttribute('data-active');
      }
    });
  }

  function updateFormatButtons() {
    if (format === 'rgba') {
      formatSwitch.setAttribute('data-format', 'rgba');
    } else {
      formatSwitch.setAttribute('data-format', 'hexa');
    }
  }
}

function parseColor(value?: string | null): RgbaColor | undefined {
  if (!value) return undefined;
  const parsed = parse(value);
  if (!parsed || typeof (parsed as any).r !== 'number') return undefined;
  const rgb = parsed as { r: number; g: number; b: number; alpha?: number };
  return {
    r: clampByte(rgb.r),
    g: clampByte(rgb.g),
    b: clampByte(rgb.b),
    a: clamp01(rgb.alpha ?? 1),
  };
}

function formatColor(color: RgbaColor, format: ColorFormat): string {
  if (format === 'rgba') return formatRgba(color);
  return formatHexa(color);
}

function formatHexa(color: RgbaColor): string {
  const r = toHex(color.r);
  const g = toHex(color.g);
  const b = toHex(color.b);
  const alpha = color.a < 1 ? toHex(Math.round(color.a * 255)) : '';
  return `#${r}${g}${b}${alpha}`;
}

function formatRgba(color: RgbaColor): string {
  const alpha = trimAlpha(color.a);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function colorKey(color: RgbaColor): string {
  return formatHexa(color).toLowerCase();
}

function isSameColor(a: RgbaColor, b: RgbaColor): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function clampByte(value: number): number {
  if (Number.isNaN(value)) return 0;
  const normalized = value <= 1 ? value * 255 : value;
  return Math.round(Math.min(255, Math.max(0, normalized)));
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, '0');
}

function trimAlpha(alpha: number): string {
  const rounded = Math.round(clamp01(alpha) * 100) / 100;
  if (rounded === 1) return '1';
  if (rounded === 0) return '0';
  return rounded.toString();
}

function createSwitchLabel(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(COLOR_PICKER_SWITCH_LABEL_CLASS);
  return span;
}

function ensureColorPickerStyles() {
  injectStyleOnce(
    COLOR_PICKER_STYLE_ID,
    `
.${COLOR_PICKER_CLASS} {
  width: 240px;
  padding: 10px;
  box-sizing: border-box;
}
.${COLOR_PICKER_SWATCHES_CLASS} {
  display: grid;
  grid-template-columns: repeat(auto-fit, 26px);
  gap: 6px;
  margin-bottom: 10px;
}
.${COLOR_PICKER_SWATCH_CLASS} {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: var(--swatch-color);
  cursor: pointer;
  padding: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.${COLOR_PICKER_SWATCH_CLASS}[data-active="true"] {
  box-shadow: 0 0 0 2px #1677ff;
  transform: translateY(-1px);
}
.${COLOR_PICKER_SWATCH_CLASS}:hover {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
}
.${COLOR_PICKER_CONTROLS_CLASS} {
  display: flex;
  align-items: center;
  gap: 6px;
}
.${COLOR_PICKER_INPUT_CLASS} {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 2px 6px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #f5f5f5;
  color: #262626;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.${COLOR_PICKER_INPUT_CLASS}:focus {
  border-color: #1677ff;
  background: #ffffff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.12);
}
.${COLOR_PICKER_INPUT_CLASS}[data-invalid="true"] {
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.12);
}
.${COLOR_PICKER_FORMAT_CLASS} {
  display: inline-flex;
}
.${COLOR_PICKER_SWITCH_CLASS} {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 110px;
  height: 30px;
  padding: 0;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.${COLOR_PICKER_SWITCH_CLASS}:hover {
  background: #ededed;
}
.${COLOR_PICKER_SWITCH_CLASS}:focus-visible {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.12);
}
.${COLOR_PICKER_SWITCH_KNOB_CLASS} {
  position: absolute;
  inset: 0;
  width: 50%;
  background: #1677ff;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}
.${COLOR_PICKER_SWITCH_CLASS}[data-format="rgba"] .${COLOR_PICKER_SWITCH_KNOB_CLASS} {
  transform: translateX(100%);
}
.${COLOR_PICKER_SWITCH_LABEL_CLASS} {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 12px;
  color: #434343;
  user-select: none;
}
.${COLOR_PICKER_SWITCH_CLASS}[data-format="hexa"] .${COLOR_PICKER_SWITCH_LABEL_CLASS}:first-child,
.${COLOR_PICKER_SWITCH_CLASS}[data-format="rgba"] .${COLOR_PICKER_SWITCH_LABEL_CLASS}:last-child {
  color: #ffffff;
}
`,
  );
}
