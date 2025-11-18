export * from './designs';
export { getItemProps, getThemeColors } from './designs/utils';
export {
  Defs,
  Ellipse,
  Fragment,
  Group,
  Path,
  Polygon,
  Rect,
  Text,
  cloneElement,
  createFragment,
  createLayout,
  getCombinedBounds,
  getElementBounds,
  getElementsBounds,
  jsx,
  jsxDEV,
  jsxs,
  renderSVG,
} from './jsx';
export type { InfographicOptions, ParsedInfographicOptions } from './options';
export {
  DEFAULT_FONT,
  Renderer,
  decodeFontFamily,
  encodeFontFamily,
  getFont,
  getFontURLs,
  getFonts,
  getPalette,
  getPaletteColor,
  getWoff2BaseURL,
  loadFont,
  loadFonts,
  registerFont,
  registerPalette,
  setDefaultFont,
} from './renderer';
export { loadSVGResource, registerResourceLoader } from './resource';
export { Infographic } from './runtime';
export { getTemplate, getTemplates, registerTemplate } from './templates';
export { getTheme, getThemes, registerTheme } from './themes';
export { parseSVG } from './utils';

export type {
  Bounds,
  ComponentType,
  DefsProps,
  EllipseProps,
  FragmentProps,
  GroupProps,
  JSXElement,
  JSXElementConstructor,
  JSXNode,
  PathProps,
  Point,
  PolygonProps,
  RectProps,
  RenderableNode,
  SVGAttributes,
  SVGProps,
  TextProps,
  WithChildren,
} from './jsx';
export type {
  Font,
  FontWeightName,
  GradientConfig,
  IRenderer,
  LinearGradient,
  Palette,
  PatternConfig,
  PatternGenerator,
  PatternStyle,
  RadialGradient,
  RoughConfig,
  StylizeConfig,
  TextAlignment,
  TextHorizontalAlign,
  TextVerticalAlign,
} from './renderer';
export type { ParsedTemplateOptions, TemplateOptions } from './templates';
export type { ThemeColors, ThemeConfig, ThemeSeed } from './themes';
export type { Data, ImageResource, ItemDatum } from './types';
