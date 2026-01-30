import { COMPONENT_ROLE } from '../../constants';
import { getViewBox, setElementRole, viewBoxToString } from '../../utils';
import { UpdateOptionsCommand } from '../commands';
import type {
  IPlugin,
  PluginInitOptions,
  viewBoxChangePayload,
} from '../types';
import { Plugin } from './base';
import { IconButton } from './components';
import { RESET_ICON } from './components/icons';

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
    const viewBox = getViewBox(svg);
    this.originViewBox = viewBoxToString(viewBox);
    emitter.on('viewBox:change', this.handleViewBoxChange);
  }

  destroy(): void {
    const { emitter } = this;
    emitter.off('viewBox:change', this.handleViewBoxChange);
    this.removeButton();
    this.resetButton?.remove();
    this.resetButton = undefined;
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
      width: '40px',
      height: '40px',
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

    const marginX = 25;
    const marginY = 25;
    const buttonSize = 40;

    // 计算相对于 offsetParent 的坐标
    // left = svg.right - parent.left - margin - buttonWidth
    const left = rect.right - parentRect.left - marginX - buttonSize;
    // top = svg.bottom - parent.top - margin - buttonHeight
    const top = rect.bottom - parentRect.top - marginY - buttonSize;

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;
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
  };
}
