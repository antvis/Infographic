---
title: Exports
---

## Structures {#structures}

### registerStructure {#register-structure}

Register a custom structure by providing the type and implementation. Structure types are documented in [Structure](/reference/infographic-types#structure).

```ts
function registerStructure(type: string, structure: Structure): void;
```

```ts
registerStructure('list-row', {
  component: ListRow,
  composites: ['list'],
});
```

### getStructure {#get-structure}

Retrieve the registered structure configuration for a given type. Returns `undefined` if missing.

```ts
function getStructure(type: string): Structure | undefined;
```

### getStructures {#get-structures}

Return the list of registered structure types.

```ts
function getStructures(): string[];
```

## Items {#items}

### registerItem {#register-item}

Register a custom item component, providing its type and definition. Item types are described in [BaseItemProps](/reference/infographic-types#base-item-props) and [Item](/reference/infographic-types#item).

```ts
function registerItem<T extends BaseItemProps>(
  type: string,
  item: Item<T>
): void;
```

```ts
registerItem('simple-item', {
  component: SimpleItem,
  composites: ['list'],
});
```

### getItem {#get-item}

Retrieve the registered item definition by type. Returns `undefined` if not found.

```ts
function getItem(type: string): Item | undefined;
```

### getItems {#get-items}

Return the list of registered item types.

```ts
function getItems(): string[];
```

### getItemProps {#get-item-props}

Split an item’s props into container-specific keys and the rest, making it easier for structure components to handle both uniformly. Input and output follow [BaseItemProps](/reference/infographic-types#base-item-props).

```ts
function getItemProps<T extends BaseItemProps>(
  props: T,
  extKeys?: string[]
): readonly [extProps: T, restProps: Record<string, any>];
```

## Fonts {#font}

### registerFont {#register-font}

Register a custom font. It returns the font entry that includes the encoded `fontFamily`. See [Font](/reference/infographic-types#font) for the structure.

```ts
function registerFont(font: Font): Font;
```

```ts
registerFont({
  fontFamily: 'Alibaba PuHuiTi',
  name: 'Alibaba PuHuiTi',
  baseUrl: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css',
  fontWeight: {regular: 'regular'},
});
```

> For font deployment instructions, check [Deploying Font Packages](https://chinese-font.netlify.app/zh-cn/post/deploy_to_cdn).

### getFont {#get-font}

Get the font configuration by name. Returns `null` if the font is not registered.

```ts
function getFont(font: string): Font | null;
```

### getFonts {#get-fonts}

List all registered fonts.

```ts
function getFonts(): Font[];
```

### setDefaultFont {#set-default-font}

Set the default font family used during rendering.

```ts
function setDefaultFont(font: string): void;
```

## Palettes {#palette}

### registerPalette {#register-palette}

Register a palette, which can be an array or a function that returns colors. See [Palette](/reference/infographic-types#palette).

```ts
function registerPalette(name: string, palette: Palette): void;
```

```ts
registerPalette('my-palette', ['#FF356A', '#7BC9FF', '#FFD166']);
```

### getPalette {#get-palette}

Retrieve a palette by name.

```ts
function getPalette(type: string): Palette | undefined;
```

### getPalettes {#get-palettes}

Return all registered palettes.

```ts
function getPalettes(): Palette[];
```

### getPaletteColor {#get-palette-color}

Pick a color from a palette by index. Accepts either a palette name or the palette itself.

```ts
function getPaletteColor(
  args: string | Palette,
  indexes: number[],
  total?: number
): string | undefined;
```

## Themes {#theme}

### registerTheme {#register-theme}

Register a theme configuration. Themes are described in [ThemeConfig](/reference/infographic-types#theme-config).

```ts
function registerTheme(name: string, theme: ThemeConfig): void;
```

```ts
registerTheme('dark', {
  colorBg: '#1F1F1F',
  base: {text: {fill: '#fff'}},
});
```

### getTheme {#get-theme}

Get a theme by its name.

```ts
function getTheme(name: string): ThemeConfig | undefined;
```

### getThemes {#get-themes}

List available theme names.

```ts
function getThemes(): string[];
```

### getThemeColors {#get-theme-colors}

Generate derived colors from a primary color, background color, and infographic configuration. Returns [ThemeColors](/reference/infographic-types#theme-colors).

```ts
function getThemeColors(
  colors: {colorPrimary?: string; colorBg?: string},
  options?: ParsedInfographicOptions
): ThemeColors;
```

## Resources {#resource-loader}

### registerResourceLoader {#register-resource-loader}

Register a custom resource loader to handle `type: 'custom'` assets. The signature is defined in [ResourceLoader](/reference/infographic-types#resource-loader).

```ts
function registerResourceLoader(loader: ResourceLoader): void;
```

```ts
registerResourceLoader(async (config) => {
  if (config.type !== 'custom') return null;
  const svgText = await fetch(config.data).then((res) => res.text());
  return loadSVGResource(svgText);
});
```

### loadSVGResource {#load-svg-resource}

Parse `<svg>` or `<symbol>` strings into reusable `SVGSymbolElement`s.

```ts
function loadSVGResource(data: string): SVGSymbolElement | null;
```

## Templates {#template}

### registerTemplate {#register-template}

Register template configurations. Template structure is defined in [TemplateOptions](/reference/infographic-types#template-options).

```ts
function registerTemplate(type: string, template: TemplateOptions): void;
```

```ts
registerTemplate('my-template', {
  design: {structure: 'list-row', item: 'simple-item'},
  theme: 'dark',
});
```

### getTemplate {#get-template}

Retrieve a template by type.

```ts
function getTemplate(type: string): TemplateOptions | undefined;
```

### getTemplates {#get-templates}

List all registered template types.

```ts
function getTemplates(): string[];
```

## SVG {#svg}

### parseSVG {#parse-svg}

Parse an SVG string into a DOM element. Throws an error when parsing fails.

```ts
function parseSVG<T extends SVGElement = SVGSVGElement>(svg: string): T | null;
```
