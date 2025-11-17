export function createElement<T extends SVGElement = SVGElement>(
  tagName: string,
  attributes: Record<string, any> = {},
) {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    tagName,
  ) as T;

  setAttributes(element, attributes);

  return element;
}

export function parseSVG<T extends SVGElement = SVGSVGElement>(
  svg: string,
): T | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid SVG string');
  }

  return doc.documentElement as unknown as T;
}

export function setAttributes(element: SVGElement, attrs: Record<string, any>) {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  });
}

export function getAttributes(
  element: SVGElement,
  attrs: readonly string[],
  ignoreEmpty = true,
) {
  return attrs.reduce(
    (acc, attr) => {
      const value = element.getAttribute(attr);
      if (!ignoreEmpty || (value !== null && value !== '')) {
        acc[attr] = value;
      }
      return acc;
    },
    {} as Record<string, string | null>,
  );
}

export function removeAttributes(element: SVGElement, attrs: string[]) {
  attrs.forEach((attr) => {
    element.removeAttribute(attr);
  });
}

export function traverse(
  node: SVGElement,
  callback: <T extends SVGElement = SVGElement>(child: T) => boolean | void,
) {
  if (callback(node as SVGElement) === false) return;

  const children = Array.from(node.children);
  children.forEach((child) => {
    traverse(child as SVGElement, callback);
  });
}

export function getOrCreateDefs(
  svg: SVGSVGElement,
  defsId: string = 'infographic-defs',
): SVGDefsElement {
  const selector = defsId ? `defs#${defsId}` : 'defs';
  const defs = svg.querySelector<SVGDefsElement>(selector);

  if (defs) return defs;

  const newDefs = createElement<SVGDefsElement>('defs');
  if (defsId) newDefs.id = defsId;
  svg.prepend(newDefs);
  return newDefs;
}

export function getSizeBaseVal(svg: SVGSVGElement): [number, number] {
  try {
    const width = svg.width.baseVal.value || 0;
    const height = svg.height.baseVal.value || 0;
    return [width, height];
  } catch (error) {
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const [x, y, width, height] = viewBox.split(' ').map(Number);
      return [width - x, height - y];
    }

    console.error('Error getting size baseVal from SVG:', error);
    return [0, 0];
  }
}
