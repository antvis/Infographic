import { COMPONENT_ROLE } from '../../../constants';
import { getCombinedBounds } from '../../../jsx';
import { IconElement, TextElement } from '../../../types';
import {
  getCommonAttrs,
  getIconAttrs,
  getTextElementProps,
  isEditableText,
  isGeometryElement,
  isIconElement,
  setElementRole,
} from '../../../utils';
import type {
  IPlugin,
  PluginInitOptions,
  Selection,
  SelectionChangePayload,
} from '../../types';
import { getElementViewportBounds, getScreenCTM } from '../../utils';
import { Plugin } from '../base';
import {
  FontAlign,
  FontColor,
  FontFamily,
  FontSize,
  IconColor,
} from './edit-items';

export interface EditBarOptions {
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
}

type EditItem = HTMLElement;

export class EditBar extends Plugin implements IPlugin {
  name = 'edit-bar';
  private container?: HTMLDivElement;
  private selection: Selection = [];

  constructor(private options?: EditBarOptions) {
    super();
  }

  init(options: PluginInitOptions) {
    super.init(options);
    const { emitter } = options;
    emitter.on('selection:change', this.handleSelectionChanged);
    emitter.on('selection:geometrychange', this.handleGeometryChanged);
    emitter.on('history:change', this.handleHistoryChanged);
  }

  destroy() {
    const { emitter } = this;
    emitter.off('selection:change', this.handleSelectionChanged);
    emitter.off('selection:geometrychange', this.handleGeometryChanged);
    emitter.off('history:change', this.handleHistoryChanged);
    this.container?.remove();
  }

  private handleSelectionChanged = ({ next }: SelectionChangePayload) => {
    this.selection = next;
    if (next.length === 0) {
      if (this.container) hideContainer(this.container);
      return;
    }
    const container = this.getOrCreateEditBar();
    const items = this.getEditItems(next);
    setContainerItems(container, items);

    this.placeEditBar(container, next);
    showContainer(container);
  };

  private handleGeometryChanged = ({
    target,
  }: {
    type: 'selection:geometrychange';
    target: Selection[number];
  }) => {
    if (!this.selection.includes(target) || !this.container) return;
    this.placeEditBar(this.container, this.selection);
    showContainer(this.container);
  };

  private handleHistoryChanged = () => {
    if (!this.container || this.selection.length === 0) return;
    this.placeEditBar(this.container, this.selection);
    showContainer(this.container);
  };

  protected getEditItems(selection: Selection) {
    let hasText = false;
    let hasIcon = false;
    let hasGeometry = false;

    for (const item of selection) {
      if (isEditableText(item)) hasText = true;
      else if (isIconElement(item)) hasIcon = true;
      else if (isGeometryElement(item)) hasGeometry = true;

      if (hasText && hasIcon && hasGeometry) break;
    }
    // Only text
    if (hasText && !hasIcon && !hasGeometry) {
      if (selection.length === 1) {
        return this.getTextEditItems(selection[0] as TextElement);
      } else {
        return this.getTextCollectionEditItems(selection as TextElement[]);
      }
    }
    // Only icon
    if (!hasText && hasIcon && !hasGeometry) {
      if (selection.length === 1) {
        return this.getIconEditItems(selection);
      } else {
        return this.getIconCollectionEditItems(selection);
      }
    }
    // Only geometry
    if (!hasText && !hasIcon && hasGeometry) {
      if (selection.length === 1) {
        return this.getGeometryEditItems(selection);
      } else {
        return this.getGeometryCollectionEditItems(selection);
      }
    }
    // Mixed or multiple elements
    return this.getElementCollectionEditItems(selection);
  }

  protected getOrCreateEditBar() {
    if (this.container) return this.container;

    const { style, className } = this.options || {};
    const container = document.createElement('div');
    Object.assign(container.style, {
      visibility: 'hidden',
      position: 'absolute',
      left: '0',
      top: '0',
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '40px',
      minWidth: '40px',
      minHeight: '40px',
      borderRadius: '8px',
      padding: '0 4px',
      backgroundColor: '#fff',
      border: '1px solid rgba(239, 240, 240, 0.9)',
      zIndex: '9999',
      boxShadow:
        'rgba(0, 0, 0, 0.08) 0px 1px 2px -2px, rgba(0, 0, 0, 0.04) 0px 2px 6px, rgba(0, 0, 0, 0.02) 0px 4px 8px 1px',
      ...style,
    } satisfies Partial<CSSStyleDeclaration>);
    if (className) {
      container.classList.add(className);
    }

    setElementRole(container, COMPONENT_ROLE);

    this.container = container;

    this.editor.getDocument().parentNode?.appendChild(container);

    return container;
  }

  protected getTextEditItems(text: TextElement): EditItem[] {
    const { attributes = {} } = getTextElementProps(text);
    return [FontColor, FontSize, FontAlign, FontFamily].map((item) =>
      item([text], attributes, this.commander),
    );
  }

  protected getTextCollectionEditItems(selection: TextElement[]): EditItem[] {
    const attrs = getCommonAttrs(
      selection.map((text) => getTextElementProps(text).attributes || {}),
    );
    return [FontColor, FontSize, FontAlign, FontFamily].map((item) =>
      item(selection, attrs, this.commander),
    );
  }

  protected getIconEditItems(selection: Selection): EditItem[] {
    const attrs = getIconAttrs(selection[0] as IconElement);
    return [IconColor].map((item) => item(selection, attrs, this.commander));
  }
  protected getIconCollectionEditItems(selection: Selection): EditItem[] {
    const attrs = getCommonAttrs(
      selection.map((icon) => getIconAttrs(icon as IconElement)),
    );
    return [IconColor].map((item) => item(selection, attrs, this.commander));
  }

  protected getGeometryEditItems(_selection: Selection): EditItem[] {
    return [];
  }

  protected getGeometryCollectionEditItems(_selection: Selection): EditItem[] {
    return [];
  }

  protected getElementCollectionEditItems(_selection: Selection): EditItem[] {
    return [];
  }

  private placeEditBar(container: HTMLDivElement, selection: Selection) {
    if (selection.length === 0) return;

    const svg = this.editor.getDocument();
    const combinedBounds = getCombinedBounds(
      selection.map((element) => getElementViewportBounds(svg, element)),
    );

    const offsetParent =
      (container.offsetParent as HTMLElement | null) ??
      (document.documentElement as HTMLElement);
    const parentRect = offsetParent.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;
    const containerRect = container.getBoundingClientRect();
    const offset = 8;

    const matrix = getScreenCTM(svg);
    const anchorTop = new DOMPoint(
      combinedBounds.x + combinedBounds.width / 2,
      combinedBounds.y,
    ).matrixTransform(matrix);
    const anchorBottom = new DOMPoint(
      combinedBounds.x + combinedBounds.width / 2,
      combinedBounds.y + combinedBounds.height,
    ).matrixTransform(matrix);

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    let left = anchorTop.x - parentRect.left - containerRect.width / 2;
    left = clamp(left, 0, Math.max(parentRect.width - containerRect.width, 0));

    // Use viewport space, not container space, to decide whether we have enough room above.
    const spaceAbove = anchorTop.y - offset;
    const spaceBelow = viewportHeight - anchorBottom.y - offset;
    const shouldPlaceAbove =
      spaceAbove >= containerRect.height || spaceAbove >= spaceBelow;

    let top = shouldPlaceAbove
      ? anchorTop.y - parentRect.top - containerRect.height - offset
      : anchorBottom.y - parentRect.top + offset;
    top = clamp(top, 0, Math.max(parentRect.height - containerRect.height, 0));

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
  }
}

function showContainer(container: HTMLDivElement) {
  container.style.visibility = 'visible';
}

function hideContainer(container: HTMLDivElement) {
  container.style.visibility = 'hidden';
}

function setContainerItems(container: HTMLDivElement, items: EditItem[]) {
  container.innerHTML = '';
  items.forEach((node) => {
    container.appendChild(node);
  });
}
