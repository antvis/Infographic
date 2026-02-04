import { COMPONENT_ROLE } from '../../constants';
import {
  getBoundViewBox,
  getViewBox,
  injectStyleOnce,
  parsePadding,
  setElementRole,
  viewBoxToString,
} from '../../utils';
import { UpdateOptionsCommand } from '../commands';
import type { IPlugin, PluginInitOptions } from '../types';
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
  private unregisterSync?: () => void;

  constructor(private options?: ResetViewBoxOptions) {
    super();
  }

  init(options: PluginInitOptions) {
    super.init(options);

    // Initialize originViewBox
    this.ensureButtonStyle();
    this.updateOriginViewBox();

    this.unregisterSync = this.editor.registerSync(
      'viewBox',
      this.handleViewBoxChange,
    );
    window.addEventListener('resize', this.handleResize);
  }

  destroy(): void {
    this.unregisterSync?.();
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

  private handleViewBoxChange = (viewBox?: string) => {
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
    });

    button.classList.add(RESET_BUTTON_CLASS);

    if (className) {
      button.classList.add(className);
    }

    if (style) {
      Object.assign(button.style, style);
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
    if (!svg.isConnected) return;
    const rect = svg.getBoundingClientRect();
    const offsetParent =
      (button.offsetParent as HTMLElement | null) ??
      (document.documentElement as HTMLElement);

    if (
      offsetParent === document.body ||
      offsetParent === document.documentElement
    ) {
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      const left = scrollX + rect.right - MARGIN_X - BUTTON_SIZE;
      const top = scrollY + rect.bottom - MARGIN_Y - BUTTON_SIZE;

      button.style.left = `${left}px`;
      button.style.top = `${top}px`;
      return;
    }

    const parentRect = offsetParent.getBoundingClientRect();
    const left = rect.right - parentRect.left - MARGIN_X - BUTTON_SIZE;
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

  private ensureButtonStyle() {
    injectStyleOnce(
      RESET_BUTTON_STYLE_ID,
      `
      button.${RESET_BUTTON_CLASS} {
        visibility: hidden;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${BUTTON_SIZE}px;
        height: ${BUTTON_SIZE}px;
        border-radius: 50%;
        padding: 4px;
        background-color: #fff;
        border: 1px solid #e5e7eb;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        cursor: pointer;
      }
      `,
    );
  }
}

const RESET_BUTTON_CLASS = 'infographic-reset-viewbox-btn';
const RESET_BUTTON_STYLE_ID = 'infographic-reset-viewbox-btn-style';
