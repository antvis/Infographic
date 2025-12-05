import pkg from '../package.json';

export const VERSION = pkg.version;
export * from './designs';
export { getItemProps, getThemeColors } from './designs/utils';
export {
  BrushSelect,
  ClickSelect,
  DblClickEditText,
  DragElement,
  HotkeyHistory,
  Interaction,
  SelectHighlight,
  ZoomWheel,
} from './editor/interactions';
export { EditBar, Plugin, ResizeElement } from './editor/plugins';
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
export {
  getFont,
  getFonts,
  getPalette,
  getPaletteColor,
  registerFont,
  registerPalette,
  registerPattern,
  setDefaultFont,
} from './renderer';
export { loadSVGResource, registerResourceLoader } from './resource';
export { Infographic } from './runtime';
export { getTemplate, getTemplates, registerTemplate } from './templates';
export { getTheme, getThemes, registerTheme } from './themes';
export { parseSVG } from './utils';

export type { EditBarOptions } from './editor';
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
export type { InfographicOptions, ParsedInfographicOptions } from './options';
export type {
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
} from './renderer';
export type { ParsedTemplateOptions, TemplateOptions } from './templates';
export type { ThemeColors, ThemeConfig, ThemeSeed } from './themes';
export type {
  Data,
  Font,
  FontWeightName,
  ImageResource,
  ItemDatum,
  TextHorizontalAlign,
  TextVerticalAlign,
} from './types';
