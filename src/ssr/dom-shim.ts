import { JSDOM } from 'jsdom';

let globalDom: JSDOM | null = null;

/**
 * Flag to indicate if we're in SSR mode (not just Node.js or tests)
 */
let isSSRMode = false;

/**
 * Check if currently in SSR mode
 */
export function isSSR(): boolean {
  return isSSRMode;
}

/**
 * Setup jsdom environment for SSR
 * Creates a singleton JSDOM instance and injects global DOM APIs
 */
export function setupDOM(): JSDOM {
  if (globalDom) return globalDom;

  // Set SSR mode flag
  isSSRMode = true;

  globalDom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true, // Enable layout calculations
  });

  // Inject global DOM APIs
  const win = globalDom.window;
  (global as any).window = win;
  (global as any).document = win.document;
  (global as any).DOMParser = win.DOMParser;
  (global as any).XMLSerializer = win.XMLSerializer;
  (global as any).MutationObserver = win.MutationObserver;

  // ============ DOM 核心元素 ============
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
    if ((win as any)[name]) (global as any)[name] = (win as any)[name];
  });

  // ============ SVG 相关 ============
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
    if ((win as any)[name]) (global as any)[name] = (win as any)[name];
  });

  // ============ FontFaceSet API (用于字体加载) ============
  // jsdom 不支持 document.fonts，需要提供 polyfill
  if (!win.document.fonts) {
    const fontSet = new Set();
    Object.defineProperty(win.document, 'fonts', {
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

  // Set a global flag to indicate SSR mode
  (global as any).__ANTV_INFOGRAPHIC_SSR__ = true;

  // Polyfill requestAnimationFrame for Node.js
  (global as any).requestAnimationFrame = (cb: any) => {
    setImmediate(cb);
    return 0;
  };

  return globalDom;
}

/**
 * Teardown jsdom environment
 * Closes the jsdom window and clears global references
 */
export function teardownDOM(): void {
  if (globalDom) {
    globalDom.window.close();
    globalDom = null;
  }
  isSSRMode = false;
  delete (global as any).__ANTV_INFOGRAPHIC_SSR__;
}
