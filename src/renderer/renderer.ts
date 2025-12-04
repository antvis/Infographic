import type { ParsedInfographicOptions } from '../options';
import {
  getDatumByIndexes,
  getItemIndexes,
  isBtnsGroup,
  isDesc,
  isGroup,
  isIllus,
  isItemDesc,
  isItemIcon,
  isItemIllus,
  isItemLabel,
  isItemValue,
  isShape,
  isShapesGroup,
  isText,
  isTitle,
  parsePadding,
  setAttributes,
  setSVGPadding,
} from '../utils';
import {
  renderBackground,
  renderBaseElement,
  renderButtonsGroup,
  renderIllus,
  renderItemIcon,
  renderItemText,
  renderShape,
  renderStaticShape,
  renderStaticText,
  renderText,
} from './composites';
import { loadFonts } from './fonts';
import type { IRenderer } from './types';

const upsert = (original: SVGElement, modified: SVGElement | null) => {
  if (original === modified) return;
  if (!modified) original.remove();
  else original.replaceWith(modified);
};

export class Renderer implements IRenderer {
  private rendered = false;

  constructor(
    private options: ParsedInfographicOptions,
    private template: SVGSVGElement,
  ) {}

  public getOptions(): ParsedInfographicOptions {
    return this.options;
  }

  public getSVG(): SVGSVGElement {
    return this.template;
  }

  render(): SVGSVGElement {
    const svg = this.getSVG();
    if (this.rendered) return svg;

    renderTemplate(svg, this.options);

    svg.style.visibility = 'hidden';
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node === svg || node.contains(svg)) {
            // post render
            setView(this.template, this.options);
            loadFonts(this.template);

            // disconnect observer
            observer.disconnect();
            svg.style.visibility = '';
          }
        });
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    this.rendered = true;
    return svg;
  }
}

function renderTemplate(svg: SVGSVGElement, options: ParsedInfographicOptions) {
  fill(svg, options);

  setSVG(svg, options);

  const { themeConfig } = options;
  renderBackground(svg, themeConfig?.colorBg);
}

function fill(svg: SVGSVGElement, options: ParsedInfographicOptions) {
  const { themeConfig, data } = options;

  renderBaseElement(svg, themeConfig.base?.global);

  const elements = svg.querySelectorAll<SVGElement>(`[data-element-type]`);

  elements.forEach((element) => {
    const id = element.id || '';
    if (isTitle(element)) {
      const modified = renderText(
        element,
        data.title || '',
        Object.assign({}, themeConfig.base?.text, themeConfig.title),
      );
      return upsert(element, modified);
    }
    if (isDesc(element)) {
      const modified = renderText(
        element,
        data.desc || '',
        Object.assign({}, themeConfig.base?.text, themeConfig.desc),
      );
      return upsert(element, modified);
    }
    if (isIllus(element)) {
      const modified = renderIllus(svg, element, data.illus?.[id]);
      return upsert(element, modified);
    }

    if (isShapesGroup(element)) {
      return Array.from(element.children).forEach((child) => {
        renderShape(svg, child as SVGElement, options);
      });
    }

    if (isShape(element)) {
      const modified = renderShape(svg, element, options);
      return upsert(element, modified);
    }

    if (isBtnsGroup(element)) {
      return renderButtonsGroup(svg, element as SVGGElement);
    }

    if (element.dataset.elementType?.startsWith('item-')) {
      const indexes = getItemIndexes(element.dataset.indexes || '0');
      const itemType = element.dataset.elementType.replace('item-', '');

      if (isItemLabel(element) || isItemDesc(element) || isItemValue(element)) {
        const modified = renderItemText(
          itemType as 'label' | 'desc' | 'value',
          element,
          options,
        );
        return upsert(element, modified);
      }
      if (isItemIllus(element)) {
        const modified = renderIllus(
          svg,
          element,
          getDatumByIndexes(data, indexes)?.illus,
        );
        return upsert(element, modified);
      }

      if (isItemIcon(element)) {
        const modified = renderItemIcon(
          svg,
          element,
          getDatumByIndexes(data, indexes)?.icon,
          options,
        );
        return upsert(element, modified);
      }
    }

    if (isText(element)) {
      return renderStaticText(element, options);
    }

    if (!isGroup(element)) {
      return renderStaticShape(element, options);
    }
  });
}

function setSVG(svg: SVGSVGElement, options: ParsedInfographicOptions) {
  const { width, height } = options;
  const { style = {}, attributes = {}, id, className } = options.svg || {};
  if (id) svg.id = id;
  if (className) svg.classList.add(className);
  if (width !== undefined) {
    svg.setAttribute('width', typeof width === 'number' ? `${width}px` : width);
  }
  if (height !== undefined) {
    svg.setAttribute(
      'height',
      typeof height === 'number' ? `${height}px` : height,
    );
  }
  Object.assign(svg.style, style);
  setAttributes(svg, attributes);
}

function setView(svg: SVGSVGElement, options: ParsedInfographicOptions) {
  const { padding = 0, viewBox } = options;

  if (viewBox) {
    svg.setAttribute('viewBox', viewBox);
  } else if (padding !== undefined) {
    setSVGPadding(svg, parsePadding(padding));
  }
}
