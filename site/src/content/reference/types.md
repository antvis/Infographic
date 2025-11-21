---
title: 类型定义
---

信息图语法的顶层配置即 [`InfographicOptions`](../learn/infographic-syntax.md)。本页补充其中涉及到的复合类型，方便在查阅语法表格时快速定位到字段的结构。

## Bounds {#bounds}

描述元素的外接矩形，常用于布局和工具函数。

```ts
type Bounds = {x: number; y: number; width: number; height: number};
```

## JSXElement {#jsx-element}

低层渲染使用的 JSX 节点定义。

```ts
interface JSXElement {
  type: string | symbol | ((props?: any) => JSXNode);
  props: Record<string, any>;
  key?: string | null;
}

## JSXNode {#jsx-node}

type JSXNode =
  | JSXElement
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXNode[];
```

> `JSXNode` 代表渲染树上的任意节点；`JSXElement` 仅指带 `type`/`props` 的节点。

## Padding {#padding}

内边距，可以是单个数字（表示所有边的内边距相同），也可以是一个数字数组，表示上、右、下、左四个边的内边距，顺序如下：

```ts
type Padding = number | number[];
```

## SVGOptions {#svg-options}

SVG 容器上的附加配置，允许为根节点设置样式、属性与标识。

| 属性       | 类型                                          | 必填 | 说明     |
| ---------- | --------------------------------------------- | ---- | -------- |
| style      | `Record<string, string \| number>`            | 否   | 内联样式 |
| attributes | `Record<string, string \| number \| boolean>` | 否   | 额外属性 |
| id         | `string`                                      | 否   | 元素 id  |
| className  | `string`                                      | 否   | 元素类名 |

## DesignOptions {#design-options}

设计配置项

| 属性      | 类型                                                                         | 必填 | 说明                                |
| --------- | ---------------------------------------------------------------------------- | ---- | ----------------------------------- |
| structure | `string` \| [WithType](#with-type)\<[StructureOptions](#structure-options)\> | 否   | 结构                                |
| title     | `string` \| [WithType](#with-type)\<[TitleOptions](#title-options)\>         | 否   | 标题                                |
| item      | `string` \| [WithType](#with-type)\<[ItemOptions](#item-options)\>           | 否   | 数据项                              |
| items     | `string` \| [WithType](#with-type)\<[ItemOptions](#item-options)\>[]         | 否   | 针对层级布局，不同层级使用不同 item |

## Data {#data}

信息图展示的数据结构。

| 属性            | 类型                       | 必填   | 说明       |
| --------------- | -------------------------- | ------ | ---------- |
| title           | `string`                   | 否     | 数据标题   |
| desc            | `string`                   | 否     | 数据描述   |
| items           | [ItemDatum](#item-datum)[] | **是** | 数据项列表 |
| `[key: string]` | `any`                      | 否     | 扩展字段   |

### ItemDatum {#item-datum}

| 属性            | 类型                                           | 必填 | 说明       |
| --------------- | ---------------------------------------------- | ---- | ---------- |
| icon            | `string` \| [ResourceConfig](#resource-config) | 否   | 图标资源   |
| label           | `string`                                       | 否   | 标题       |
| desc            | `string`                                       | 否   | 描述       |
| value           | `number`                                       | 否   | 数值       |
| illus           | `string` \| [ResourceConfig](#resource-config) | 否   | 插画       |
| children        | [ItemDatum](#item-datum)[]                     | 否   | 嵌套项     |
| `[key: string]` | `any`                                          | 否   | 自定义字段 |

## ThemeConfig {#theme-config}

主题配置项

| 属性          | 类型                                                                                                                                                                                    | 必填 | 说明         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------ |
| colorBg       | `string`                                                                                                                                                                                | 否   | 背景色       |
| colorPrimary  | `string`                                                                                                                                                                                | 否   | 整体主色     |
| base          | \{ global?: [DynamicAttributes](#dynamic-attributes)\<[BaseAttributes](#base-attributes)\>; shape?: [ShapeAttributes](#shape-attributes); text?: [TextAttributes](#text-attributes); \} | 否   | 全局基础样式 |
| base.`global` | [DynamicAttributes](#dynamic-attributes)\<[BaseAttributes](#base-attributes)\>                                                                                                          | 否   | 全局基础配置 |
| base.`shape`  | [ShapeAttributes](#shape-attributes)                                                                                                                                                    | 否   | 全局图形配置 |
| base.`text`   | [TextAttributes](#text-attributes)                                                                                                                                                      | 否   | 全局文本配置 |
| palette       | [Palette](#palette)                                                                                                                                                                     | 否   | 色板         |
| title         | [TextAttributes](#text-attributes)                                                                                                                                                      | 否   | 标题样式     |
| desc          | [TextAttributes](#text-attributes)                                                                                                                                                      | 否   | 描述样式     |
| item          | `object`                                                                                                                                                                                | 否   | 数据项配置   |
| item.`icon`   | [DynamicAttributes](#dynamic-attributes)\<[IconAttributes](#icon-attributes)\>                                                                                                          | 否   | 图标配置     |
| item.`label`  | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | 否   | 标签配置     |
| item.`desc`   | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | 否   | 描述配置     |
| item.`value`  | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | 否   | 值配置       |
| stylize       | [StylizeConfig](#stylize-config) \| `null`                                                                                                                                              | 否   | 风格化       |

## BaseAttributes {#base-attributes}

基础属性集合，用于定义通用的填充与透明度。

| 属性           | 类型               | 必填 | 说明         |
| -------------- | ------------------ | ---- | ------------ |
| opacity        | `number \| string` | 否   | 不透明度     |
| fill           | `string`           | 否   | 填充色       |
| fill-opacity   | `number \| string` | 否   | 填充不透明度 |
| stroke         | `string`           | 否   | 描边颜色     |
| stroke-opacity | `number \| string` | 否   | 描边不透明度 |

## ThemeSeed {#theme-seed}

主题输入种子。

| 属性         | 类型      | 必填   | 说明           |
| ------------ | --------- | ------ | -------------- |
| colorPrimary | `string`  | **是** | 原始主色       |
| colorBg      | `string`  | 否     | 背景色         |
| isDarkMode   | `boolean` | 否     | 是否为暗色模式 |

## ThemeColors {#theme-colors}

根据 `ThemeSeed` 计算出的完整主题色值。

| 属性               | 类型      | 必填   | 说明                 |
| ------------------ | --------- | ------ | -------------------- |
| colorPrimary       | `string`  | **是** | 原始主色             |
| colorPrimaryBg     | `string`  | **是** | 主色浅色背景         |
| colorPrimaryText   | `string`  | **是** | 主色背景上的文本颜色 |
| colorText          | `string`  | **是** | 最深文本颜色         |
| colorTextSecondary | `string`  | **是** | 次要文本颜色         |
| colorWhite         | `string`  | **是** | 纯白色               |
| colorBg            | `string`  | **是** | 画布背景色           |
| colorBgElevated    | `string`  | **是** | 卡片背景色           |
| isDarkMode         | `boolean` | **是** | 是否为暗色模式       |

## IconAttributes {#icon-attributes}

图标（通常为 `<use>` 或 `<image>`）可配置的属性。

| 属性         | 类型               | 必填 | 说明       |
| ------------ | ------------------ | ---- | ---------- |
| id           | `number \| string` | 否   | 元素 id    |
| class        | `number \| string` | 否   | 元素类名   |
| x            | `number \| string` | 否   | X 坐标     |
| y            | `number \| string` | 否   | Y 坐标     |
| width        | `number \| string` | 否   | 宽度       |
| height       | `number \| string` | 否   | 高度       |
| href         | `number \| string` | 否   | 资源地址   |
| fill         | `number \| string` | 否   | 填充色     |
| fill-opacity | `number \| string` | 否   | 填充不透明 |
| opacity      | `number \| string` | 否   | 不透明度   |

## ShapeAttributes {#shape-attributes}

| 属性              | 类型                                  | 必填 | 说明         |
| ----------------- | ------------------------------------- | ---- | ------------ |
| opacity           | `number \| string`                    | 否   | 不透明度     |
| fill              | `string`                              | 否   | 填充色       |
| fill-opacity      | `number \| string`                    | 否   | 填充不透明度 |
| fill-rule         | `'nonzero' \| 'evenodd' \| 'inherit'` | 否   | 填充规则     |
| stroke            | `string`                              | 否   | 描边颜色     |
| stroke-width      | `number \| string`                    | 否   | 描边宽度     |
| stroke-linecap    | `number \| string`                    | 否   | 描边端点样式 |
| stroke-linejoin   | `number \| string`                    | 否   | 描边连接样式 |
| stroke-dasharray  | `number \| string`                    | 否   | 描边虚线数组 |
| stroke-dashoffset | `number \| string`                    | 否   | 描边虚线偏移 |
| stroke-opacity    | `number \| string`                    | 否   | 描边不透明度 |

## TextAttributes {#text-attributes}

| 属性              | 类型               | 必填 | 说明         |
| ----------------- | ------------------ | ---- | ------------ |
| x                 | `number \| string` | 否   | X 坐标       |
| y                 | `number \| string` | 否   | Y 坐标       |
| width             | `number \| string` | 否   | 宽度         |
| height            | `number \| string` | 否   | 高度         |
| text-alignment    | `string`           | 否   | 文本对齐方式 |
| font-family       | `string`           | 否   | 字体族       |
| font-size         | `number \| string` | 否   | 字体大小     |
| font-weight       | `number \| string` | 否   | 字体粗细     |
| font-style        | `number \| string` | 否   | 字体样式     |
| font-variant      | `number \| string` | 否   | 字体变体     |
| letter-spacing    | `number \| string` | 否   | 字符间距     |
| line-height       | `number \| string` | 否   | 行高         |
| fill              | `number \| string` | 否   | 填充色       |
| stroke            | `number \| string` | 否   | 描边颜色     |
| stroke-width      | `number \| string` | 否   | 描边宽度     |
| text-anchor       | `number \| string` | 否   | 文本锚点     |
| dominant-baseline | `number \| string` | 否   | 基线对齐     |

## ResourceConfig {#resource-config}

描述需要加载的图形、图片或远程[资源](/learn/resources)。

| 属性            | 类型                                       | 必填   | 说明             |
| --------------- | ------------------------------------------ | ------ | ---------------- |
| type            | `'image' \| 'svg' \| 'remote' \| 'custom'` | **是** | 资源类型         |
| data            | `string`                                   | **是** | 资源的标识或数据 |
| `[key: string]` | `any`                                      | 否     | 资源扩展配置     |

## DynamicAttributes {#dynamic-attributes}

泛型工具类型，可以让属性既支持直接赋值，也支持使用函数根据运行时上下文动态生成。

```ts
type DynamicAttributes<T extends object> = {
  [key in keyof T]?:
    | T[key]
    | ((value: T[key], node: SVGElement) => T[key] | undefined);
};
```

- `T`：目标属性映射，例如 `TextAttributes`。
- `node`：当前属性所在的 SVG 元素，可用于按节点上下文返回差异化样式。

## Palette {#palette}

主题色板的类型别名，支持多种定义方式：

```ts
type Palette =
  | string
  | string[]
  | ((ratio: number, index: number, count: number) => string);
```

- `string`：使用[注册的色板](/reference/built-in-palettes)。
- `string[]`：离散颜色列表，数据项将按顺序循环使用。
- 函数：根据数据项占比（ratio）、索引（index）以及总数（count）返回颜色。

> 如果要注册色板，参考[自定义色板](/learn/custom-palette)。

## StylizeConfig {#stylize-config}

风格化配置的联合类型，支持三种风格：手绘、图案、渐变。

```ts
type StylizeConfig = RoughConfig | PatternConfig | GradientConfig;
```

### RoughConfig {#rough-config}

| 属性       | 类型      | 必填   | 说明         |
| ---------- | --------- | ------ | ------------ |
| type       | `'rough'` | **是** | 启用手绘风格 |
| roughness  | `number`  | 否     | 抖动强度     |
| bowing     | `number`  | 否     | 弯曲程度     |
| fillWeight | `number`  | 否     | 填充线粗细   |
| hachureGap | `number`  | 否     | 线条间距     |

### PatternConfig {#pattern-config}

| 属性            | 类型             | 必填   | 说明                                                   |
| --------------- | ---------------- | ------ | ------------------------------------------------------ |
| type            | `'pattern'`      | **是** | 启用图案填充                                           |
| pattern         | `string`         | **是** | 图案名称（见[内置图案](/reference/built-in-patterns)） |
| backgroundColor | `string \| null` | 否     | 背景色                                                 |
| foregroundColor | `string \| null` | 否     | 前景色                                                 |
| scale           | `number \| null` | 否     | 缩放比例                                               |

### PatternStyle {#pattern-style}

`PatternStyle` 为 `PatternConfig` 的公共样式片段，字段含义同上：`backgroundColor`、`foregroundColor`、`scale`。

### GradientConfig {#gradient-config}

渐变配置的联合类型：

```ts
type GradientConfig = LinearGradient | RadialGradient;
```

#### LinearGradient {#linear-gradient}

| 属性   | 类型                                              | 必填   | 说明         |
| ------ | ------------------------------------------------- | ------ | ------------ |
| type   | `'linear-gradient'`                               | **是** | 线性渐变类型 |
| colors | `string[] \| { color: string; offset: string }[]` | 否     | 渐变色列表   |
| angle  | `number`                                          | 否     | 渐变角度     |

#### RadialGradient {#radial-gradient}

| 属性   | 类型                                              | 必填   | 说明         |
| ------ | ------------------------------------------------- | ------ | ------------ |
| type   | `'radial-gradient'`                               | **是** | 径向渐变类型 |
| colors | `string[] \| { color: string; offset: string }[]` | 否     | 渐变色列表   |

## TemplateOptions {#template-options}

在 [InfographicOptions](/learn/infographic-syntax#infographic-options) 的基础上移除了 `container`、`template`、`data` 属性。

```ts
type TemplateOptions = Omit<
  InfographicOptions,
  'container' | 'template' | 'data'
>;
```

## 其他类型 {#other-types}

### WithType {#with-type}

为任意类型追加 `type` 字段，常用于显式声明组件类型：

```ts
type WithType\<T\> = T & {type: string};
```

### WithProps {#with-props}

为任意类型附加 `props` 扩展字段，便于携带渲染所需的额外参数：

```ts
type WithProps<T, P = any> = T & {props?: P};
```
