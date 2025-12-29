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

export function loadFont(svg: SVGSVGElement, font: string) {
  const doc = svg.ownerDocument;
  const target = doc?.head || document.head;
  if (!target) return;

  if (!FONT_LOAD_MAP.has(target)) FONT_LOAD_MAP.set(target, new Map());
  const map = FONT_LOAD_MAP.get(target)!;

  const links: HTMLLinkElement[] = [];
  const urls = getFontURLs(font);
  urls.forEach((url) => {
    const id = `${font}-${url}`;
    if (map.has(id)) return;

    const link = doc.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = url;
    links.push(link);
    map.set(id, link);
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
