import { merge } from 'lodash-es';
import {
  DesignOptions,
  getItem,
  getStructure,
  getTemplate,
  NullableParsedDesignsOptions,
  ParsedDesignsOptions,
  Title,
} from '../designs';
import { getPaletteColor } from '../renderer';
import type { TemplateOptions } from '../templates';
import { generateThemeColors, getTheme, type ThemeConfig } from '../themes';
import {
  isDarkColor,
  isNonNullableParsedDesignsOptions,
  parsePadding,
} from '../utils';
import type { InfographicOptions, ParsedInfographicOptions } from './types';

export function parseOptions(
  options: Partial<InfographicOptions>,
): Partial<ParsedInfographicOptions> {
  const {
    container = '#container',
    padding = 0,
    template,
    design,
    theme,
    themeConfig,
    ...restOptions
  } = options;

  const parsedContainer =
    typeof container === 'string'
      ? document.querySelector(container) || document.createElement('div')
      : container;

  const templateOptions: TemplateOptions | undefined = template
    ? getTemplate(template)
    : undefined;
  const mergedThemeConfig = merge(
    {},
    templateOptions?.themeConfig,
    themeConfig,
  );
  const resolvedThemeConfig =
    theme || themeConfig || templateOptions?.themeConfig
      ? parseTheme(theme, mergedThemeConfig)
      : undefined;

  const parsed: Partial<ParsedInfographicOptions> = {
    container: parsedContainer as HTMLElement,
    padding: parsePadding(padding),
  };

  if (templateOptions) {
    const { design: templateDesign, ...restTemplateOptions } = templateOptions;
    Object.assign(parsed, restTemplateOptions);
  }

  Object.assign(parsed, restOptions);

  if (template) parsed.template = template;
  if (templateOptions?.design || design) {
    const parsedDesign = parseDesign(
      { ...templateOptions?.design, ...design },
      resolvedThemeConfig
        ? { ...options, themeConfig: resolvedThemeConfig }
        : options,
    );

    if (isNonNullableParsedDesignsOptions(parsedDesign)) {
      parsed.design = parsedDesign;
    }
  }
  if (theme) parsed.theme = theme;
  if (resolvedThemeConfig) {
    parsed.themeConfig = resolvedThemeConfig;
  }
  return parsed;
}

function normalizeWithType<T extends { type: string }>(obj: string | T): T {
  if (typeof obj === 'string') return { type: obj } as T;
  if (!('type' in obj)) throw new Error('Type is required');
  return obj as T;
}

function parseDesign(
  config: DesignOptions,
  options: Partial<InfographicOptions>,
): NullableParsedDesignsOptions {
  const { structure, title, item, items } = config || {};
  const defaultItem = parseDesignItem(item || items?.[0], options);
  return {
    structure: parseDesignStructure(structure),
    title: parseDesignTitle(title, options),
    item: defaultItem,
    items: !items
      ? [defaultItem]
      : items.map((item) => parseDesignItem(item, options)),
  };
}

function parseDesignStructure(
  config: DesignOptions['structure'],
): ParsedDesignsOptions['structure'] | null {
  if (!config) return null;
  const { type, ...userProps } = normalizeWithType(config);
  const structure = getStructure(type);
  if (!structure) return null;
  const { component } = structure;
  return {
    ...structure,
    component: (props) => component({ ...props, ...userProps }),
  };
}

function parseDesignTitle(
  config: DesignOptions['title'],
  options: Partial<InfographicOptions>,
): ParsedDesignsOptions['title'] {
  if (!config) return { component: null };
  const { type, ...userProps } = normalizeWithType(config);

  const { themeConfig } = options;
  const background = themeConfig?.colorBg || '#fff';
  const themeColors = generateColors(background, background);
  // use default title for now
  return {
    component: (props: Parameters<typeof Title>[0]) =>
      Title({ ...props, themeColors, ...userProps }),
  };
}

function parseDesignItem(
  config: DesignOptions['item'],
  options: Partial<InfographicOptions>,
): ParsedDesignsOptions['item'] | null {
  if (!config) return null;
  const { type, ...userProps } = normalizeWithType(config);
  const item = getItem(type);
  if (!item) return null;
  const { component, options: itemOptions } = item;
  return {
    ...item,
    component: (props) => {
      const { indexes } = props;
      const { data, themeConfig } = options;
      const background = themeConfig?.colorBg || '#fff';

      const {
        themeColors = generateColors(
          getPaletteColor(themeConfig?.palette, indexes, data?.items?.length) ||
            themeConfig?.colorPrimary ||
            '#FF356A',
          background,
        ),
        ...restProps
      } = props;

      return component({
        themeColors,
        ...restProps,
        ...userProps,
      });
    },
    options: itemOptions,
  };
}

function parseTheme(
  theme: string | undefined,
  themeConfig: ThemeConfig = {},
): ThemeConfig {
  const base = theme ? getTheme(theme) || {} : {};
  const parsedThemeConfig = merge({}, base, themeConfig);
  parsedThemeConfig.palette = themeConfig.palette || base.palette;
  parsedThemeConfig.stylize = themeConfig.stylize ?? base.stylize;

  if (!parsedThemeConfig.colorPrimary) {
    parsedThemeConfig.colorPrimary = '#FF356A';
  }
  if (!parsedThemeConfig.palette) {
    parsedThemeConfig.palette = [parsedThemeConfig.colorPrimary];
  }
  return parsedThemeConfig;
}

function generateColors(colorPrimary: string, background: string = '#fff') {
  return generateThemeColors({
    colorPrimary,
    isDarkMode: isDarkColor(background),
    colorBg: background,
  });
}
