---
title: 导出内容
---

## 结构 {#structures}

### registerStructure {#register-structure}

注册自定义结构，提供结构类型与实现组件后即可在模板中使用。结构类型见 [Structure](/reference/infographic-types#structure)。

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

根据结构类型获取注册的结构配置，未找到时返回 `undefined`。

```ts
function getStructure(type: string): Structure | undefined;
```

### getStructures {#get-structures}

返回当前已经注册的结构类型列表。

```ts
function getStructures(): string[];
```

## 数据项 {#items}

### registerItem {#register-item}

注册自定义数据项组件，传入类型与组件定义。数据项类型见 [BaseItemProps](/reference/infographic-types#base-item-props) 与 [Item](/reference/infographic-types#item)。

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

按类型获取注册的数据项，未注册时返回 `undefined`。

```ts
function getItem(type: string): Item | undefined;
```

### getItems {#get-items}

返回已注册的数据项类型列表。

```ts
function getItems(): string[];
```

### getItemProps {#get-item-props}

拆分数据项的容器参数与组件参数，便于在结构组件中统一处理。输入输出基于 [BaseItemProps](/reference/infographic-types#base-item-props)。

```ts
function getItemProps<T extends BaseItemProps>(
  props: T,
  extKeys?: string[]
): readonly [extProps: T, restProps: Record<string, any>];
```

## 字体 {#font}

### registerFont {#register-font}

注册自定义字体，返回记录了编码后 `fontFamily` 的字体对象。字体结构见 [Font](/reference/infographic-types#font)。

```ts
function registerFont(font: Font): Font;
```

```ts
registerFont({
  fontFamily: 'Alibaba PuHuiTi',
  name: '阿里巴巴普惠体',
  baseUrl: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css',
  fontWeight: {regular: 'regular'},
});
```

> 部署字体资源详见[字体分包部署与使用](https://chinese-font.netlify.app/zh-cn/post/deploy_to_cdn)

### getFont {#get-font}

根据字体名获取字体配置，未注册时返回 `null`。

```ts
function getFont(font: string): Font | null;
```

### getFonts {#get-fonts}

获取所有已注册的字体列表。

```ts
function getFonts(): Font[];
```

### setDefaultFont {#set-default-font}

设置渲染时的默认字体族名称。

```ts
function setDefaultFont(font: string): void;
```

## 色板 {#palette}

### registerPalette {#register-palette}

注册一组色板，可为数组或返回色值的函数。色板类型见 [Palette](/reference/infographic-types#palette)。

```ts
function registerPalette(name: string, palette: Palette): void;
```

```ts
registerPalette('my-palette', ['#FF356A', '#7BC9FF', '#FFD166']);
```

### getPalette {#get-palette}

获取指定名称的色板。

```ts
function getPalette(type: string): Palette | undefined;
```

### getPalettes {#get-palettes}

返回所有已注册的色板集合。

```ts
function getPalettes(): Palette[];
```

### getPaletteColor {#get-palette-color}

根据索引从色板中取色，支持直接传入色板或色板名称。

```ts
function getPaletteColor(
  args: string | Palette,
  indexes: number[],
  total?: number
): string | undefined;
```

## 主题 {#theme}

### registerTheme {#register-theme}

注册主题配置，主题名可用于后续获取。主题结构见 [ThemeConfig](/reference/infographic-types#theme-config)。

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

按名称获取主题配置。

```ts
function getTheme(name: string): ThemeConfig | undefined;
```

### getThemes {#get-themes}

列出当前注册的主题名称。

```ts
function getThemes(): string[];
```

### getThemeColors {#get-theme-colors}

根据主色、背景色和信息图配置生成一组主题衍生色，返回值见 [ThemeColors](/reference/infographic-types#theme-colors)。

```ts
function getThemeColors(
  colors: {colorPrimary?: string; colorBg?: string},
  options?: ParsedInfographicOptions
): ThemeColors;
```

## 资源 {#resource-loader}

### registerResourceLoader {#register-resource-loader}

注册自定义资源加载器，用于处理 `type: 'custom'` 的资源。签名见 [ResourceLoader](/reference/infographic-types#resource-loader)。

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

将 `<svg>` 或 `<symbol>` 字符串解析为可复用的 `SVGSymbolElement`。

```ts
function loadSVGResource(data: string): SVGSymbolElement | null;
```

## 模板 {#template}

### registerTemplate {#register-template}

注册模板配置，使用模板类型标识。模板结构见 [TemplateOptions](/reference/infographic-types#template-options)。

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

根据模板类型获取模板配置。

```ts
function getTemplate(type: string): TemplateOptions | undefined;
```

### getTemplates {#get-templates}

列出当前注册的模板类型。

```ts
function getTemplates(): string[];
```

## SVG {#svg}

### parseSVG {#parse-svg}

将 SVG 字符串解析为 DOM 元素，解析失败会抛出异常。

```ts
function parseSVG<T extends SVGElement = SVGSVGElement>(svg: string): T | null;
```
