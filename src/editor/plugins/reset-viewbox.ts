import { COMPONENT_ROLE } from '../../constants';
import {
  getBoundViewBox,
  getViewBox,
  parsePadding,
  setElementRole,
  viewBoxToString,
} from '../../utils';
import { UpdateOptionsCommand } from '../commands';
import type {
  IPlugin,
  PluginInitOptions,
  viewBoxChangePayload,
} from '../types';
import { Plugin } from './base';
import { IconButton } from './components';
import { RESET_ICON } from './components/icons';

const MARGIN_X = 25;
const MARGIN_Y = 25;
const BUTTON_SIZE = 40;
export interface ResetViewBoxOptions {
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  getContainer?: HTMLElement | (() => HTMLElement);
}

export class ResetViewBox extends Plugin implements IPlugin {
  name = 'reset-viewBox';

  private originViewBox!: string;
  private resetButton?: HTMLButtonElement;
  private viewBoxChanged = false;

  constructor(private options?: ResetViewBoxOptions) {
    super();
  }

  init(options: PluginInitOptions) {
    super.init(options);
    const { emitter } = options;
    const svg = this.editor.getDocument();

    // Initialize originViewBox
    this.updateOriginViewBox();

    emitter.on('viewBox:change', this.handleViewBoxChange);
    window.addEventListener('resize', this.handleResize);
  }

  destroy(): void {
    const { emitter } = this;
    emitter.off('viewBox:change', this.handleViewBoxChange);
    window.removeEventListener('resize', this.handleResize);
    this.removeButton();
  }

  private handleResize = () => {
    this.updateOriginViewBox();
    this.updatePosition();
  };

  private updateOriginViewBox() {
    const svg = this.editor.getDocument();
    // In Node env or before render, fallback to current viewBox attribute
    if (!svg.getBBox) {
      this.originViewBox = viewBoxToString(getViewBox(svg));
      return;
    }

    // In Browser, calculate fit
    const { padding } = this.state.getOptions();
    this.originViewBox = getBoundViewBox(svg, parsePadding(padding));
  }

  private handleViewBoxChange = ({ viewBox }: viewBoxChangePayload) => {
    const svg = this.editor.getDocument();

    this.viewBoxChanged = viewBox !== this.originViewBox;

    if (!this.viewBoxChanged) {
      if (this.resetButton) this.hideButton(this.resetButton);
      return;
    }
    const button = this.getOrCreateResetButton();

    this.placeButton(button, svg);
    this.showButton(button);
  };

  protected getOrCreateResetButton = () => {
    if (this.resetButton) return this.resetButton;

    const { style, className } = this.options || {};

    const button = IconButton({
      icon: RESET_ICON,
      onClick: this.resetViewBox,
    }) as HTMLButtonElement;

    Object.assign(button.style, {
      visibility: 'hidden',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: `${BUTTON_SIZE}px`,
      height: `${BUTTON_SIZE}px`,
      borderRadius: '8px',
      padding: '4px',
      backgroundColor: '#fff',
      border: '1px solid rgba(239, 240, 240, 0.9)',
      zIndex: '1000',
      boxShadow:
        'rgba(0, 0, 0, 0.08) 0px 1px 2px -2px, rgba(0, 0, 0, 0.04) 0px 2px 6px, rgba(0, 0, 0, 0.02) 0px 4px 8px 1px',
      cursor: 'pointer',
      ...style,
    } satisfies Partial<CSSStyleDeclaration>);

    if (className) {
      button.classList.add(className);
    }

    setElementRole(button, COMPONENT_ROLE);

    this.resetButton = button;

    const { getContainer } = this.options || {};
    const resolvedContainer =
      typeof getContainer === 'function' ? getContainer() : getContainer;
    const containerParent = resolvedContainer ?? document.body;

    containerParent?.appendChild(button);

    return button;
  };

  private placeButton = (button: HTMLButtonElement, svg: SVGSVGElement) => {
    const rect = svg.getBoundingClientRect();
    const offsetParent = (button.offsetParent as HTMLElement) || document.body;
    let parentRect = { left: 0, top: 0 };

    // 如果挂载点不是 body，需要计算相对于 offsetParent 的位置
    if (
      offsetParent !== document.body &&
      offsetParent !== document.documentElement
    ) {
      parentRect = offsetParent.getBoundingClientRect();
    } else {
      // 如果是 body，需要考虑滚动条
      parentRect = {
        left: -window.scrollX,
        top: -window.scrollY,
      };
    }

    // 计算相对于 offsetParent 的坐标
    // left = svg.right - parent.left - margin - buttonWidth
    const left = rect.right - parentRect.left - MARGIN_X - BUTTON_SIZE;
    // top = svg.bottom - parent.top - margin - buttonHeight
    const top = rect.bottom - parentRect.top - MARGIN_Y - BUTTON_SIZE;

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
  };

  private updatePosition = () => {
    if (this.resetButton && this.viewBoxChanged) {
      this.placeButton(this.resetButton, this.editor.getDocument());
    }
  };

  private resetViewBox = () => {
    const command = new UpdateOptionsCommand({
      viewBox: this.originViewBox,
    });
    void this.commander.execute(command);
  };

  private showButton = (button: HTMLButtonElement) => {
    button.style.display = 'flex';
    button.style.visibility = 'visible';
  };

  private hideButton = (button: HTMLButtonElement) => {
    button.style.display = 'none';
  };

  private removeButton = () => {
    this.viewBoxChanged = false;
    this.resetButton?.remove();
    this.resetButton = undefined;
  };
}
