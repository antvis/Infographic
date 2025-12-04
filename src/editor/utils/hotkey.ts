type HotkeyBinding = {
  combos: HotkeyCombo[];
  handler: (event: KeyboardEvent) => void;
};

type HotkeyCombo = {
  key: string;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  mod?: boolean;
};

export type HotkeyOptions = {
  /**
   * 热键监听的目标，默认监听 document。
   */
  target?: Document | HTMLElement;
  /**
   * 额外的过滤逻辑，返回 false 时会跳过本次事件。
   */
  filter?: (event: KeyboardEvent) => boolean;
};

const isEditableTarget = (target: EventTarget | null) => {
  if (!target) return false;
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

const normalizeCombo = (combo: string): HotkeyCombo => {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);

  const comboObj: HotkeyCombo = { key: '' };

  parts.forEach((part) => {
    if (part === 'shift') comboObj.shift = true;
    else if (part === 'alt' || part === 'option') comboObj.alt = true;
    else if (part === 'ctrl' || part === 'control') comboObj.ctrl = true;
    else if (part === 'meta' || part === 'cmd' || part === 'command')
      comboObj.meta = true;
    else if (part === 'mod') comboObj.mod = true;
    else comboObj.key = part;
  });

  if (!comboObj.key) {
    throw new Error(`Invalid hotkey combo: "${combo}"`);
  }

  return comboObj;
};

const matchCombo = (event: KeyboardEvent, combo: HotkeyCombo) => {
  const key = event.key.toLowerCase();
  if (key !== combo.key) return false;

  const wantsMod = combo.mod ?? false;
  const hasMeta = event.metaKey;
  const hasCtrl = event.ctrlKey;
  const hasMod = hasMeta || hasCtrl;
  const matchesStrict = (expected: boolean | undefined, actual: boolean) =>
    expected === undefined ? !actual : expected === actual;

  if (wantsMod && !hasMod) return false;

  if (wantsMod) {
    if (!matchesStrict(combo.shift, event.shiftKey)) return false;
    if (!matchesStrict(combo.alt, event.altKey)) return false;
    if (combo.meta !== undefined && !matchesStrict(combo.meta, hasMeta))
      return false;
    if (combo.ctrl !== undefined && !matchesStrict(combo.ctrl, hasCtrl))
      return false;
    return true;
  }

  if (!matchesStrict(combo.meta, hasMeta)) return false;
  if (!matchesStrict(combo.ctrl, hasCtrl)) return false;
  if (!matchesStrict(combo.shift, event.shiftKey)) return false;
  if (!matchesStrict(combo.alt, event.altKey)) return false;

  return true;
};

export class Hotkey {
  private target: Document | HTMLElement;
  private filter?: (event: KeyboardEvent) => boolean;
  private bindings: HotkeyBinding[] = [];

  constructor(options: HotkeyOptions = {}) {
    const { target = document, filter } = options;
    this.target = target;
    this.filter = filter;

    this.target.addEventListener('keydown', this.handleKeydown);
  }

  bind(combo: string | string[], handler: (event: KeyboardEvent) => void) {
    const combos = Array.isArray(combo) ? combo : [combo];
    const binding: HotkeyBinding = {
      combos: combos.map((c) => normalizeCombo(c)),
      handler,
    };
    this.bindings.push(binding);

    return () => this.unbind(binding);
  }

  destroy() {
    this.target.removeEventListener('keydown', this.handleKeydown);
    this.bindings = [];
  }

  private unbind(binding: HotkeyBinding) {
    this.bindings = this.bindings.filter((item) => item !== binding);
  }

  private handleKeydown: EventListener = (event) => {
    if (!(event instanceof KeyboardEvent)) return;
    if (event.defaultPrevented) return;
    if (isEditableTarget(event.target)) return;
    if (this.filter && !this.filter(event)) return;

    for (const binding of this.bindings) {
      if (binding.combos.some((combo) => matchCombo(event, combo))) {
        binding.handler(event);
        break;
      }
    }
  };
}
