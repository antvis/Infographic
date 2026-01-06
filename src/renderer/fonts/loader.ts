import {
  getSvgLoadPromise,
  trackSvgLoadPromise,
} from '../../resource/load-tracker';
import { join, normalizeFontWeightName, splitFontFamily } from '../../utils';
import { getFont, getFonts } from './registry';

export function getFontURLs(font: string): string[] {
  const urls = splitFontFamily(font).flatMap((family) => {
    const config = getFont(family);
    if (!config) return [];
    const { baseUrl, fontWeight } = config;
    return Object.values(fontWeight)
      .filter((url): url is string => !!url)
      .map((url) => join(baseUrl, url));
  });

  return Array.from(new Set(urls));
}

export function getWoff2BaseURL(
  font: string,
  fontWeightName: string,
): string | null {
  const families = splitFontFamily(font);
  let config = null as ReturnType<typeof getFont>;
  for (const family of families) {
    config = getFont(family);
    if (config) break;
  }
  if (!config) return null;

  const name = normalizeFontWeightName(fontWeightName);
  const path = config.fontWeight[name];
  if (!path) return null;
  return join(config.baseUrl, path.replace(/\/result.css$/, ''));
}

const FONT_LOAD_MAP = new WeakMap<
  HTMLHeadElement,
  Map<string, HTMLLinkElement>
>();
const FONT_PROMISE_MAP = new WeakMap<
  HTMLHeadElement,
  Map<string, Promise<void>>
>();

function trackFontPromise(
  target: HTMLHeadElement,
  id: string,
  promise: Promise<void>,
): Promise<void> {
  let map = FONT_PROMISE_MAP.get(target);
  if (!map) {
    map = new Map();
    FONT_PROMISE_MAP.set(target, map);
  }

  map.set(id, promise);

  promise.finally(() => {
    const map = FONT_PROMISE_MAP.get(target);
    if (!map) return;
    if (map.get(id) === promise) map.delete(id);
    if (map.size === 0) FONT_PROMISE_MAP.delete(target);
  });

  return promise;
}

function isLinkLoaded(link: HTMLLinkElement): boolean {
  if (link.dataset.infographicFontLoaded === 'true') return true;
  try {
    return !!link.sheet;
  } catch {
    return false;
  }
}

function getFontLoadPromise(
  target: HTMLHeadElement,
  id: string,
  link?: HTMLLinkElement,
): Promise<void> {
  const existing = FONT_PROMISE_MAP.get(target)?.get(id);
  if (existing) return existing;

  if (!link || isLinkLoaded(link)) {
    return trackFontPromise(target, id, Promise.resolve());
  }

  const promise = new Promise<void>((resolve) => {
    const done = () => {
      link.dataset.infographicFontLoaded = 'true';
      resolve();
    };
    link.addEventListener('load', done, { once: true });
    link.addEventListener('error', done, { once: true });
  });

  return trackFontPromise(target, id, promise);
}

export function loadFont(svg: SVGSVGElement, font: string) {
  const doc = svg.ownerDocument;
  const target = doc?.head || document.head;
  if (!target) return;

  if (!FONT_LOAD_MAP.has(target)) FONT_LOAD_MAP.set(target, new Map());
  const map = FONT_LOAD_MAP.get(target)!;

  const urls = getFontURLs(font);
  if (!urls.length) return;

  const links: HTMLLinkElement[] = [];
  urls.forEach((url) => {
    const id = `${font}-${url}`;
    const promiseKey = `font:${id}`;
    if (getSvgLoadPromise<void>(svg, promiseKey)) return;

    let link = map.get(id);
    if (!link) {
      link = doc.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = url;
      links.push(link);
      map.set(id, link);
    }

    const promise = getFontLoadPromise(target, id, link);
    trackSvgLoadPromise(svg, promiseKey, promise);
  });

  if (!links.length) return;

  if (target.tagName === 'HEAD') {
    links.forEach((link) => target.appendChild(link));
  }
}

export function loadFonts(svg: SVGSVGElement) {
  const fonts = getFonts();
  fonts.forEach((font) => loadFont(svg, font.fontFamily));
}
