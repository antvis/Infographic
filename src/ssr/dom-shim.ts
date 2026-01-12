import { parseHTML, DOMParser, Document } from 'linkedom';

let globalDoc: Document | null = null;
let globalWin: any = null;

let isSSRMode = false;

export function isSSR(): boolean {
  return isSSRMode;
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
    'XMLSerializer',
    'MutationObserver',
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
