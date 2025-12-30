import { parseHTML, DOMParser, Document } from 'linkedom';

let globalDoc: Document | null = null;
let globalWin: any = null;

let isSSRMode = false;

export function isSSR(): boolean {
  return isSSRMode;
}

// Map lowercase to proper camelCase
const TAG_CASE_MAP: Record<string, string> = {
  'foreignobject': 'foreignObject',
  'lineargradient': 'linearGradient',
  'radialgradient': 'radialGradient',
  'clippath': 'clipPath',
  'textpath': 'textPath',
  'animatemotion': 'animateMotion',
  'animatetransform': 'animateTransform',
};

class SimpleXMLSerializer {
  serializeToString(node: any): string {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: {
        const tagName = node.tagName.toLowerCase();
        // Use proper camelCase for SVG elements
        const outputTagName = TAG_CASE_MAP[tagName] || tagName;

        let attrs = '';
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            attrs += ` ${attr.name}="${attr.value.replace(/"/g, '&quot;')}"`;
          }
        }

        // Special handling for foreignObject (contains HTML content)
        if (outputTagName === 'foreignObject') {
          const innerHTML = this.serializeForeignObjectContent(node);
          return `<${outputTagName}${attrs}>${innerHTML}</${outputTagName}>`;
        }

        let content = '';
        if (node.childNodes) {
          for (let i = 0; i < node.childNodes.length; i++) {
            content += this.serializeToString(node.childNodes[i]);
          }
        }

        if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
          return `<${tagName}${attrs}>`;
        }
        return `<${outputTagName}${attrs}>${content}</${outputTagName}>`;
      }
      case Node.TEXT_NODE:
        return node.data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      case Node.COMMENT_NODE:
        return `<!--${node.data}-->`;
      case Node.DOCUMENT_NODE: {
        let docContent = '';
        if (node.documentElement) {
          docContent = this.serializeToString(node.documentElement);
        }
        return `<?xml version="1.0" encoding="UTF-8"?>${docContent}`;
      }
      case Node.DOCUMENT_TYPE_NODE: {
        return `<!DOCTYPE ${node.name}>`;
      }
      case Node.CDATA_SECTION_NODE: {
        return `<![CDATA[${node.data}]]>`;
      }
      default:
        return '';
    }
  }

  private serializeForeignObjectContent(foreignObject: any): string {
    if (foreignObject.childNodes && foreignObject.childNodes.length > 0) {
      let content = '';
      for (let i = 0; i < foreignObject.childNodes.length; i++) {
        const child = foreignObject.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          content += this.serializeElementWithInnerHTML(child);
        } else if (child.nodeType === Node.TEXT_NODE) {
          content += child.data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      }
      return content;
    }
    return '';
  }

  private serializeElementWithInnerHTML(element: any): string {
    // Preserve original tag name for case-sensitive elements
    const originalTagName = element.tagName;
    const tagName = originalTagName.toLowerCase();
    let attrs = '';
    if (element.attributes) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        attrs += ` ${attr.name}="${attr.value.replace(/"/g, '&quot;')}"`;
      }
    }
    if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName)) {
      return `<${tagName}${attrs}>`;
    }
    let content = '';
    if (element.childNodes) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          content += this.serializeElementWithInnerHTML(child);
        } else if (child.nodeType === Node.TEXT_NODE) {
          content += child.data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else if (child.nodeType === Node.COMMENT_NODE) {
          content += `<!--${child.data}-->`;
        }
      }
    }
    return `<${tagName}${attrs}>${content}</${tagName}>`;
  }
}

export function setupDOM(): { window: any; document: Document } {
  if (globalDoc && globalWin) return { window: globalWin, document: globalDoc };

  isSSRMode = true;

  const { document, window } = parseHTML('<!DOCTYPE html><html><body><div id="container"></div></body></html>');

  globalDoc = document;
  globalWin = window;

  (global as any).window = window;
  (global as any).document = document;
  (global as any).DOMParser = DOMParser;
  (global as any).XMLSerializer = SimpleXMLSerializer;
  (global as any).MutationObserver = window.MutationObserver;

  const domClasses = [
    'HTMLElement',
    'HTMLDivElement',
    'HTMLSpanElement',
    'HTMLImageElement',
    'HTMLCanvasElement',
    'HTMLInputElement',
    'HTMLButtonElement',
    'Element',
    'Node',
    'Text',
    'Comment',
    'DocumentFragment',
    'Document',
  ];
  domClasses.forEach((name) => {
    if ((window as any)[name]) (global as any)[name] = (window as any)[name];
  });

  const svgClasses = [
    'SVGElement',
    'SVGSVGElement',
    'SVGGraphicsElement',
    'SVGGElement',
    'SVGPathElement',
    'SVGRectElement',
    'SVGCircleElement',
    'SVGTextElement',
    'SVGLineElement',
    'SVGPolygonElement',
    'SVGPolylineElement',
    'SVGEllipseElement',
    'SVGImageElement',
    'SVGDefsElement',
    'SVGUseElement',
    'SVGClipPathElement',
    'SVGLinearGradientElement',
    'SVGRadialGradientElement',
    'SVGStopElement',
    'SVGPatternElement',
    'SVGMaskElement',
    'SVGForeignObjectElement',
  ];
  svgClasses.forEach((name) => {
    if ((window as any)[name]) (global as any)[name] = (window as any)[name];
  });

  if (!(document as any).fonts) {
    const fontSet = new Set();
    Object.defineProperty(document, 'fonts', {
      value: {
        add: (font: unknown) => fontSet.add(font),
        delete: (font: unknown) => fontSet.delete(font),
        has: (font: unknown) => fontSet.has(font),
        clear: () => fontSet.clear(),
        forEach: (callback: (font: unknown) => void) => fontSet.forEach(callback),
        entries: () => fontSet.entries(),
        keys: () => fontSet.keys(),
        values: () => fontSet.values(),
        [Symbol.iterator]: () => fontSet[Symbol.iterator](),
        get size() {
          return fontSet.size;
        },
        get ready() {
          return Promise.resolve(this);
        },
        check: () => true,
        load: () => Promise.resolve([]),
        get status() {
          return 'loaded';
        },
        onloading: null,
        onloadingdone: null,
        onloadingerror: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      },
      configurable: true,
    });
  }

  (globalThis as any).__ANTV_INFOGRAPHIC_SSR__ = true;

  (globalThis as any).requestAnimationFrame = (cb: any) => {
    setImmediate(cb);
    return 0;
  };

  return { window, document };
}

/**
 * Teardown linkedom environment
 * Clears global references
 */
export function teardownDOM(): void {
  globalDoc = null;
  globalWin = null;
  isSSRMode = false;
  delete (globalThis as any).__ANTV_INFOGRAPHIC_SSR__;
}
