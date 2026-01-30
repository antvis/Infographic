import { injectStyleOnce } from '../../../utils';

export type SelectValue = string;

export type SelectOption = {
  label?: string;
  value: SelectValue;
  disabled?: boolean;
  render?: () => HTMLElement;
};

export type SelectProps = {
  options: SelectOption[];
  value?: SelectValue;
  placeholder?: string;
  onChange?: (value: SelectValue, option?: SelectOption) => void;
  renderOption?: (option: SelectOption) => HTMLElement;
  renderLabel?: (
    option: SelectOption | undefined,
  ) => HTMLElement | string | null | undefined;
};

export type SelectHandle = {
  setValue: (value: SelectValue) => void;
  getValue: () => SelectValue | undefined;
  setOptions: (options: SelectOption[]) => void;
  destroy: () => void;
};

const SELECT_CLASS = 'infographic-edit-select';
const SELECT_STYLE_ID = 'infographic-edit-select-style';
const OPTION_CLASS = `${SELECT_CLASS}__option`;
const DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const LABEL_CLASS = `${SELECT_CLASS}__label`;
const ARROW_CLASS = `${SELECT_CLASS}__arrow`;

export function Select(props: SelectProps): HTMLDivElement & SelectHandle {
  ensureSelectStyle();

  let open = false;
  let options = props.options || [];
  let selected: SelectValue | undefined = props.value;

  const container = document.createElement('div');
  container.classList.add(SELECT_CLASS);
  container.tabIndex = 0;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.classList.add(TRIGGER_CLASS);

  const label = document.createElement('span');
  label.classList.add(LABEL_CLASS);
  trigger.appendChild(label);

  const arrow = document.createElement('span');
  arrow.classList.add(ARROW_CLASS);
  arrow.textContent = 'v';
  trigger.appendChild(arrow);

  const dropdown = document.createElement('div');
  dropdown.classList.add(DROPDOWN_CLASS);
  dropdown.setAttribute('data-open', 'false');

  container.appendChild(trigger);
  container.appendChild(dropdown);

  const handleDocumentClick = (event: MouseEvent) => {
    if (!container.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  const renderLabel = () => {
    const option = options.find((opt) => opt.value === selected);
    const custom = props.renderLabel?.(option);
    if (typeof custom === 'string') {
      label.textContent = custom;
    } else if (custom instanceof HTMLElement) {
      label.replaceChildren(custom);
    } else if (custom === null || custom === undefined) {
      if (option) {
        label.textContent = option.label ?? option.value;
      } else {
        label.textContent = props.placeholder ?? '请选择';
      }
    } else {
      label.textContent = String(custom);
    }
  };

  const renderOptions = () => {
    dropdown.innerHTML = '';
    options.forEach((option) => {
      const optionNode =
        props.renderOption?.(option) ??
        option.render?.() ??
        defaultOptionNode(option);

      optionNode.classList.add(OPTION_CLASS);
      optionNode.setAttribute('data-value', option.value);
      if (option.disabled) {
        optionNode.setAttribute('aria-disabled', 'true');
        optionNode.classList.add(`${OPTION_CLASS}--disabled`);
      } else {
        optionNode.addEventListener('click', () => {
          selectValue(option.value, option);
        });
      }
      dropdown.appendChild(optionNode);
    });
  };

  const selectValue = (value: SelectValue, option?: SelectOption) => {
    selected = value;
    renderLabel();
    props.onChange?.(value, option);
    setOpen(false);
  };

  const setOpen = (value: boolean) => {
    open = value;
    dropdown.setAttribute('data-open', String(open));
    container.setAttribute('data-open', String(open));
    if (open) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }
  };

  trigger.addEventListener('click', () => setOpen(!open));

  renderLabel();
  renderOptions();

  const api: SelectHandle = {
    setValue: (value) => {
      selected = value;
      renderLabel();
    },
    getValue: () => selected,
    setOptions: (nextOptions) => {
      options = nextOptions;
      renderOptions();
      renderLabel();
    },
    destroy: () => {
      document.removeEventListener('click', handleDocumentClick);
      container.remove();
    },
  };

  return Object.assign(container, api);
}

function ensureSelectStyle() {
  injectStyleOnce(
    SELECT_STYLE_ID,
    `
.${SELECT_CLASS} {
  position: relative;
  display: inline-flex;
  min-width: 140px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.${TRIGGER_CLASS} {
  width: 100%;
  height: 32px;
  padding: 4px 28px 4px 8px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #000000d9;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.${TRIGGER_CLASS}:hover {
  border-color: #4096ff;
}
.${TRIGGER_CLASS}:focus-visible {
  border-color: #4096ff;
  box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
}
.${LABEL_CLASS} {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.${ARROW_CLASS} {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  font-size: 10px;
  color: #8c8c8c;
}
.${DROPDOWN_CLASS} {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05);
  padding: 4px 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  display: none;
}
.${DROPDOWN_CLASS}[data-open="true"] {
  display: block;
}
.${OPTION_CLASS} {
  padding: 6px 12px;
  font-size: 12px;
  color: #000000d9;
  cursor: pointer;
  line-height: 1.5;
}
.${OPTION_CLASS}:hover {
  background: #f5f5f5;
}
.${OPTION_CLASS}--disabled {
  color: #bfbfbf;
  cursor: not-allowed;
}
.${OPTION_CLASS}--disabled:hover {
  background: transparent;
}
`,
  );
}

function defaultOptionNode(option: SelectOption) {
  const node = document.createElement('div');
  node.textContent = option.label ?? option.value;
  return node;
}
