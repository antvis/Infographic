import type { FontFace as CSSFontFace, Declaration, Stylesheet } from 'css';
// @ts-expect-error ignore
import parse from 'css/lib/parse';
import { getFontURLs, getWoff2BaseURL } from '../renderer';
import {
  createElement,
  decodeFontFamily,
  fetchWithCache,
  join,
  normalizeFontWeightName,
  splitFontFamily,
} from '../utils';

interface FontFaceAttributes {
  'font-family': string;
  src: string;
  'font-style': string;
  'font-display': string;
  'font-weight': string;
  'unicode-range': string;
}

export async function embedFonts(svg: SVGSVGElement, embedResources = true) {
  // 1. 收集使用到的 font-family
  const usedFonts = collectUsedFonts(svg);
  if (usedFonts.size === 0) return;

  const parsedFontsFaces: FontFaceAttributes[] = [];

  // 2. 对每个使用到的字体，解析 CSS + 结合 document.fonts 的实际加载子集
  await Promise.all(
    Array.from(usedFonts).map(async (fontFamily) => {
      const loadedFonts = getActualLoadedFontFace(fontFamily);
      if (!loadedFonts.length) return;

      const cssFontFaces = await parseFontFamily(fontFamily);
      if (!cssFontFaces.length) return;

      const processed = await Promise.all(
        cssFontFaces.map(async (rawFace) => {
          const fontFace = normalizeFontFace(rawFace);

          const unicodeRange = fontFace['unicode-range'].replace(/\s/g, '');
          const subset = loadedFonts.find(
            (font) =>
              font.unicodeRange &&
              font.unicodeRange.replace(/\s/g, '') === unicodeRange,
          );

          // 如果找不到对应子集，就不处理这个 font-face
          if (!subset) return null;

          const baseURL = getWoff2BaseURL(
            fontFace['font-family'],
            normalizeFontWeightName(fontFace['font-weight']),
          );
          if (!baseURL) return null;

          // 更宽松地从 src 中提取 .woff2 URL 片段
          const urlMatch = fontFace.src.match(
            /url\(["']?(.*?\.woff2)[^"']*["']?\)/,
          );
          if (!urlMatch?.[1]) return null;

          const woff2URL = join(baseURL, urlMatch[1]);

          if (embedResources) {
            const woff2DataUrl = await loadWoff2(woff2URL);
            fontFace.src = `url(${woff2DataUrl}) format('woff2')`;
          } else {
            fontFace.src = `url(${woff2URL}) format('woff2')`;
          }

          return fontFace;
        }),
      );

      parsedFontsFaces.push(
        ...((processed.filter(Boolean) as FontFaceAttributes[]) || []),
      );
    }),
  );

  // 3. 创建 <style>@font-face...</style> 并插入 SVG
  if (parsedFontsFaces.length > 0) {
    insertFontStyle(svg, parsedFontsFaces);
  }
}

/**
 * 收集 SVG 中用到的 font-family
 */
function collectUsedFonts(svg: SVGSVGElement) {
  const usedFonts = new Set<string>();

  const addFamilies = (fontFamilyString: string | null | undefined) => {
    if (!fontFamilyString) return;
    splitFontFamily(fontFamilyString).forEach((family) => {
      const decodedFontFamily = decodeFontFamily(family);
      if (decodedFontFamily) usedFonts.add(decodedFontFamily);
    });
  };

  addFamilies(svg.getAttribute('font-family'));

  const textElements =
    svg.querySelectorAll<HTMLSpanElement>('foreignObject span');

  for (const span of textElements) {
    addFamilies(span.style.fontFamily);
  }

  return usedFonts;
}

/**
 * 解析给定 font-family 对应的 CSS @font-face
 */
export async function parseFontFamily(fontFamily: string) {
  const urls = getFontURLs(fontFamily);

  const fontFaces: Partial<FontFaceAttributes>[] = [];

  await Promise.allSettled(
    urls.map(async (url) => {
      const css = await fetchWithCache(url)
        .then((res) => res.text())
        .then((text) => parse(text) as Stylesheet)
        .catch(() => {
          console.error(`Failed to fetch or parse font CSS: ${url}`);
          return null;
        });

      css?.stylesheet?.rules.forEach((rule) => {
        if (rule.type === 'font-face') {
          const fontFace = parseFontFace(rule as CSSFontFace);
          fontFaces.push(fontFace);
        }
      });
    }),
  );

  return fontFaces;
}

/**
 * 从 document.fonts 中获取给定 family 且已加载的 FontFace
 */
export function getActualLoadedFontFace(fontFamily: string) {
  const fonts: FontFace[] = [];
  const families = splitFontFamily(fontFamily).map((family) =>
    decodeFontFamily(family),
  );

  document.fonts.forEach((font) => {
    if (
      families.includes(decodeFontFamily(font.family)) &&
      font.status === 'loaded'
    ) {
      fonts.push(font);
    }
  });

  return fonts;
}

/**
 * 从 css 的 FontFace 规则中提取声明
 */
function parseFontFace(rule: CSSFontFace) {
  const declarations = (rule.declarations || []) as Declaration[];
  const attrs: Record<string, string> = {};

  declarations.forEach((declaration) => {
    const { property, value } = declaration;
    if (property && value) {
      attrs[property] = value;
    }
  });

  // 这里返回 Partial，后面统一 normalize
  return attrs as Partial<FontFaceAttributes>;
}

/**
 * 将不完整的 FontFaceAttributes 补全为完整结构，给后续逻辑使用
 */
function normalizeFontFace(
  face: Partial<FontFaceAttributes>,
): FontFaceAttributes {
  return {
    'font-family': face['font-family'] ?? '',
    src: face.src ?? '',
    'font-style': face['font-style'] ?? 'normal',
    'font-display': face['font-display'] ?? 'swap',
    'font-weight': face['font-weight'] ?? '400',
    'unicode-range': face['unicode-range'] ?? 'U+0-FFFF',
  };
}

/**
 * 将 @font-face 写入 <style>，插入到 SVG 中合适的位置
 */
function insertFontStyle(svg: SVGSVGElement, fontFaces: FontFaceAttributes[]) {
  // 简单去重：相同 family + weight + style + unicode-range + src 只保留一条
  const unique: FontFaceAttributes[] = [];
  const seen = new Set<string>();

  for (const f of fontFaces) {
    const key = [
      f['font-family'],
      f['font-weight'],
      f['font-style'],
      f['unicode-range'],
      f.src,
    ].join('|');

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }

  if (unique.length === 0) return;

  const style = createElement('style', { type: 'text/css' });

  style.innerHTML = unique
    .map((f) =>
      `
@font-face {
  font-family: ${f['font-family']};
  src: ${f.src};
  font-style: ${f['font-style']};
  font-weight: ${f['font-weight']};
  font-display: ${f['font-display']};
  unicode-range: ${f['unicode-range']};
}
`.trim(),
    )
    .join('\n');

  // 尽量插在 <defs> 后面，否则插在第一个子节点前
  const defs = svg.querySelector('defs');
  if (defs && defs.parentNode) {
    defs.parentNode.insertBefore(style, defs.nextSibling);
  } else {
    svg.insertBefore(style, svg.firstChild);
  }
}

/**
 * 加载 woff2 并转为 DataURL
 */
async function loadWoff2(url: string) {
  const response = await fetchWithCache(url);
  if (!response.ok) {
    throw new Error(`Failed to load font: ${url}`);
  }

  const blob = await response.blob();

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return dataUrl;
}
