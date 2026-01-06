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
  const { embedResources = true, removeIds = false } = options;
  const clonedSVG = svg.cloneNode(true) as SVGSVGElement;
  const { width, height } = getViewBox(svg);
  setAttributes(clonedSVG, { width, height });

  if (removeIds) {
    inlineUseElements(clonedSVG);
    inlineDefsReferences(clonedSVG);
  } else {
    await embedIcons(clonedSVG);
  }
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

function inlineUseElements(svg: SVGSVGElement) {
  const uses = Array.from(svg.querySelectorAll<SVGUseElement>('use'));
  if (!uses.length) return;

  uses.forEach((use) => {
    const href = getUseHref(use);
    if (!href || !href.startsWith('#')) return;
    const target = resolveUseTarget(svg, href);
    if (!target || target === use) return;

    const replacement = createInlineElement(use, target);
    if (!replacement) return;
    use.replaceWith(replacement);
  });
}

function getUseHref(use: SVGUseElement) {
  return use.getAttribute('href') ?? use.getAttribute('xlink:href');
}

function resolveUseTarget(svg: SVGSVGElement, href: string) {
  const localTarget = svg.querySelector(href);
  if (localTarget) return localTarget as SVGElement;
  const docTarget = document.querySelector(href);
  return docTarget as SVGElement | null;
}

function createInlineElement(use: SVGUseElement, target: SVGElement) {
  const tag = target.tagName.toLowerCase();
  if (tag === 'symbol') {
    return materializeSymbol(use, target as SVGSymbolElement);
  }
  if (tag === 'svg') {
    return materializeSVG(use, target as SVGSVGElement);
  }
  return materializeElement(use, target);
}

function materializeSymbol(use: SVGUseElement, symbol: SVGSymbolElement) {
  const symbolClone = symbol.cloneNode(true) as SVGSymbolElement;
  const svg = createElement<SVGSVGElement>('svg');

  applyAttributes(svg, symbolClone, new Set(['id']));
  applyAttributes(svg, use, new Set(['href', 'xlink:href']));

  while (symbolClone.firstChild) {
    svg.appendChild(symbolClone.firstChild);
  }

  return svg;
}

function materializeSVG(use: SVGUseElement, source: SVGSVGElement) {
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.removeAttribute('id');
  applyAttributes(clone, use, new Set(['href', 'xlink:href']));
  return clone;
}

function materializeElement(use: SVGUseElement, source: SVGElement) {
  const clone = source.cloneNode(true) as SVGElement;
  clone.removeAttribute('id');

  const wrapper = createElement<SVGGElement>('g');
  applyAttributes(
    wrapper,
    use,
    new Set(['href', 'xlink:href', 'x', 'y', 'width', 'height', 'transform']),
  );

  const transform = buildUseTransform(use);
  if (transform) {
    wrapper.setAttribute('transform', transform);
  }

  wrapper.appendChild(clone);
  return wrapper;
}

function buildUseTransform(use: SVGUseElement) {
  const x = use.getAttribute('x');
  const y = use.getAttribute('y');
  const translate = x || y ? `translate(${x ?? 0} ${y ?? 0})` : '';
  const transform = use.getAttribute('transform') ?? '';
  if (translate && transform) return `${translate} ${transform}`;
  return translate || transform || null;
}

function applyAttributes(
  target: SVGElement,
  source: SVGElement,
  exclude: Set<string> = new Set(),
) {
  Array.from(source.attributes).forEach((attr) => {
    if (exclude.has(attr.name)) return;
    if (attr.name === 'style') {
      mergeStyleAttribute(target, attr.value);
      return;
    }
    if (attr.name === 'class') {
      mergeClassAttribute(target, attr.value);
      return;
    }
    target.setAttribute(attr.name, attr.value);
  });
}

function mergeStyleAttribute(target: SVGElement, value: string) {
  const current = target.getAttribute('style');
  if (!current) {
    target.setAttribute('style', value);
    return;
  }
  const separator = current.trim().endsWith(';') ? '' : ';';
  target.setAttribute('style', `${current}${separator}${value}`);
}

function mergeClassAttribute(target: SVGElement, value: string) {
  const current = target.getAttribute('class');
  if (!current) {
    target.setAttribute('class', value);
    return;
  }
  target.setAttribute('class', `${current} ${value}`.trim());
}

const urlRefRegex = /url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g;
function inlineDefsReferences(svg: SVGSVGElement) {
  const referencedIds = collectReferencedIds(svg);
  if (referencedIds.size === 0) {
    removeDefs(svg);
    return;
  }

  const defsDataUrl = createDefsDataUrl(svg, referencedIds);
  if (!defsDataUrl) return;

  traverse(svg, (node) => {
    if (node.tagName.toLowerCase() === 'defs') return false;
    const attrs = Array.from(node.attributes);
    attrs.forEach((attr) => {
      const value = attr.value;
      if (!value.includes('url(')) return;
      const updated = value.replace(urlRefRegex, (_match, id) => {
        const encodedId = encodeURIComponent(id);
        return `url("${defsDataUrl}#${encodedId}")`;
      });
      if (updated !== value) node.setAttribute(attr.name, updated);
    });
  });

  removeDefs(svg);
}

function collectReferencedIds(svg: SVGSVGElement) {
  const ids = new Set<string>();
  traverse(svg, (node) => {
    if (node.tagName.toLowerCase() === 'defs') return false;
    collectIdsFromAttributes(node, (id) => ids.add(id));
  });
  return ids;
}

function collectIdsFromAttributes(
  node: SVGElement,
  addId: (id: string) => void,
) {
  for (const attr of Array.from(node.attributes)) {
    const value = attr.value;
    if (value.includes('url(')) {
      for (const match of value.matchAll(urlRefRegex)) {
        if (match[1]) addId(match[1]);
      }
    }
    if (
      (attr.name === 'href' || attr.name === 'xlink:href') &&
      value[0] === '#'
    ) {
      addId(value.slice(1));
    }
  }
}

function createDefsDataUrl(svg: SVGSVGElement, ids: Set<string>) {
  if (ids.size === 0) return null;

  const collected = collectDefElements(svg, ids);
  if (collected.size === 0) return null;

  const defsSvg = createElement<SVGSVGElement>('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
  });
  const defs = createElement<SVGDefsElement>('defs');

  collected.forEach((node) => {
    defs.appendChild(node.cloneNode(true));
  });

  if (!defs.children.length) return null;
  defsSvg.appendChild(defs);

  const serialized = new XMLSerializer().serializeToString(defsSvg);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialized);
}

function collectDefElements(svg: SVGSVGElement, ids: Set<string>) {
  const collected = new Map<string, SVGElement>();
  const queue = Array.from(ids);
  const queued = new Set(queue);
  const visited = new Set<string>();
  const enqueue = (id: string) => {
    if (visited.has(id) || queued.has(id)) return;
    queue.push(id);
    queued.add(id);
  };

  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const selector = `#${escapeCssId(id)}`;
    const target = svg.querySelector(selector);
    if (!target) continue;
    collected.set(id, target as SVGElement);

    traverse(target as SVGElement, (node) => {
      collectIdsFromAttributes(node, enqueue);
    });
  }

  return collected;
}

function escapeCssId(id: string) {
  if (globalThis.CSS && typeof globalThis.CSS.escape === 'function') {
    return globalThis.CSS.escape(id);
  }
  return id.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
}

function removeDefs(svg: SVGSVGElement) {
  const defsList = Array.from(svg.querySelectorAll('defs'));
  defsList.forEach((defs) => defs.remove());
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
