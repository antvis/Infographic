import { ElementTypeEnum } from '../constants';
import {
  createElement,
  getElementByRole,
  getViewBox,
  setAttributes,
  setElementRole,
  traverse,
} from '../utils';
import { embedFonts } from './font';
import type { SVGExportOptions } from './types';

export async function exportToSVGString(
  svg: SVGSVGElement,
  options: Omit<SVGExportOptions, 'type'> = {},
) {
  const node = await exportToSVG(svg, options);
  const str = new XMLSerializer().serializeToString(node);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
}

export async function exportToSVG(
  svg: SVGSVGElement,
  options: Omit<SVGExportOptions, 'type'> = {},
) {
  const { embedResources = true } = options;
  const clonedSVG = svg.cloneNode(true) as SVGSVGElement;
  const { width, height } = getViewBox(svg);
  setAttributes(clonedSVG, { width, height });

  await embedIcons(clonedSVG);
  await embedFonts(clonedSVG, embedResources);

  cleanSVG(clonedSVG);

  return clonedSVG;
}

async function embedIcons(svg: SVGSVGElement) {
  const icons = svg.querySelectorAll('use');
  const defs = getDefs(svg);

  icons.forEach((icon) => {
    const href = icon.getAttribute('href');
    if (!href) return;
    const existsSymbol = svg.querySelector(href);

    if (!existsSymbol) {
      const symbolElement = document.querySelector(href);
      if (symbolElement) defs.appendChild(symbolElement.cloneNode(true));
    }
  });
}

const iconRole = 'icon-defs';
function getDefs(svg: SVGSVGElement) {
  const defs = getElementByRole(svg, iconRole);
  if (defs) return defs;
  const _defs = createElement('defs');
  setElementRole(_defs, iconRole);
  svg.prepend(_defs);
  return _defs;
}

function cleanSVG(svg: SVGSVGElement) {
  removeBtnGroup(svg);
  removeTransientContainer(svg);
  removeUselessAttrs(svg);

  clearDataset(svg);
}

function removeBtnGroup(svg: SVGSVGElement) {
  const btnGroup = getElementByRole(svg, ElementTypeEnum.BtnsGroup);
  btnGroup?.remove();

  const btnIconDefs = getElementByRole(svg, 'btn-icon-defs');
  btnIconDefs?.remove();
}

function removeTransientContainer(svg: SVGSVGElement) {
  const transientContainer = svg.querySelector(
    '[data-element-type=transient-container]',
  );
  transientContainer?.remove();
}

function removeUselessAttrs(svg: SVGSVGElement) {
  const groups = svg.querySelectorAll('g');
  groups.forEach((group) => {
    group.removeAttribute('x');
    group.removeAttribute('y');
    group.removeAttribute('width');
    group.removeAttribute('height');
  });
}

function clearDataset(svg: SVGSVGElement) {
  traverse(svg, (node) => {
    for (const key in node.dataset) {
      delete node.dataset[key];
    }
  });
}
