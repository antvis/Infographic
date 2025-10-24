# @antv/infographic API 文档

本文档提供了 @antv/infographic 框架的完整 API 参考。

## 目录

- [核心类](#核心类)
  - [Infographic](#infographic)
- [配置选项](#配置选项)
  - [InfographicOptions](#infographicoptions)
  - [Data](#data)
  - [DesignOptions](#designoptions)
  - [ThemeConfig](#themeconfig)
- [类型定义](#类型定义)
- [工具函数](#工具函数)
- [注册器](#注册器)

---

## 核心类

### Infographic

信息图的主类，用于创建和渲染信息图。

#### 构造函数

```typescript
constructor(options: InfographicOptions)
```

创建一个新的 Infographic 实例。

**参数：**

- `options` - 信息图配置选项

**示例：**

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '示例',
    items: [{ label: '项目 1' }],
  },
});
```

#### 方法

##### render()

```typescript
render(): void
```

将信息图渲染到容器中。

**示例：**

```typescript
infographic.render();
```

##### compose()

```typescript
compose(): SVGSVGElement
```

创建信息图模版对象。

**返回值：**

- `SVGSVGElement` - SVG 元素

**示例：**

```typescript
const svgElement = infographic.compose();
document.body.appendChild(svgElement);
```

---

## 配置选项

### InfographicOptions

创建信息图时的配置选项。

```typescript
interface InfographicOptions {
  container?: string | HTMLElement;
  width?: number;
  height?: number;
  padding?: Padding;
  template?: string;
  design?: DesignOptions;
  data: Data;
  theme?: string;
  themeConfig?: ThemeConfig;
}
```

#### 属性

##### container

- **类型：** `string | HTMLElement`
- **可选**
- **描述：** 渲染容器，可以是 CSS 选择器字符串或 DOM 元素

**示例：**

```typescript
container: '#my-container';
// 或
container: document.getElementById('my-container');
```

##### width

- **类型：** `number`
- **可选**
- **描述：** 信息图宽度（像素）

##### height

- **类型：** `number`
- **可选**
- **描述：** 信息图高度（像素）

##### padding

- **类型：** `Padding`
- **可选**
- **描述：** 容器内边距

**Padding 类型：**

```typescript
type Padding =
  | number // 统一内边距
  | [number, number] // [垂直, 水平]
  | [number, number, number, number] // [上, 右, 下, 左]
  | { top?: number; right?: number; bottom?: number; left?: number };
```

**示例：**

```typescript
padding: 20                          // 所有方向 20px
padding: [10, 20]                    // 上下 10px, 左右 20px
padding: [10, 20, 10, 20]            // 上 10px, 右 20px, 下 10px, 左 20px
padding: { top: 10, left: 20 }       // 仅设置上和左
```

##### template

- **类型：** `string`
- **可选**
- **描述：** 使用的模板名称

**示例：**

```typescript
template: 'process-flow';
```

##### design

- **类型：** `DesignOptions`
- **可选**
- **描述：** 设计配置，包括结构、数据项等

详见 [DesignOptions](#designoptions)

##### data

- **类型：** `Data`
- **必需**
- **描述：** 信息图数据

详见 [Data](#data)

##### theme

- **类型：** `string`
- **可选**
- **默认值：** `'default'`
- **描述：** 使用的主题名称

**示例：**

```typescript
theme: 'dark';
```

##### themeConfig

- **类型：** `ThemeConfig`
- **可选**
- **描述：** 主题配置，用于自定义或覆盖主题

详见 [ThemeConfig](#themeconfig)

---

### Data

信息图的数据结构。

```typescript
interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  illus?: Record<string, string | ResourceConfig>;
  [key: string]: any;
}
```

#### 属性

##### title

- **类型：** `string`
- **可选**
- **描述：** 信息图标题

##### desc

- **类型：** `string`
- **可选**
- **描述：** 信息图描述文本

##### items

- **类型：** `ItemDatum[]`
- **必需**
- **描述：** 数据项数组

##### illus

- **类型：** `Record<string, string | ResourceConfig>`
- **可选**
- **描述：** 全局插图资源映射

**示例：**

```typescript
illus: {
  background: 'https://example.com/bg.jpg',
  logo: { url: 'https://example.com/logo.svg' }
}
```

---

### ItemDatum

单个数据项的结构。

```typescript
interface ItemDatum {
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  illus?: string | ResourceConfig;
  children?: ItemDatum[];
  [key: string]: any;
}
```

#### 属性

##### icon

- **类型：** `string | ResourceConfig`
- **可选**
- **描述：** 图标资源，可以是 URL 字符串或资源配置对象

**示例：**

```typescript
icon: 'star'
icon: 'https://example.com/icon.svg'
icon: { url: 'https://example.com/icon.svg', format: 'svg' }
```

##### label

- **类型：** `string`
- **可选**
- **描述：** 数据项标签

##### desc

- **类型：** `string`
- **可选**
- **描述：** 数据项描述

##### value

- **类型：** `number`
- **可选**
- **描述：** 数据项数值

##### illus

- **类型：** `string | ResourceConfig`
- **可选**
- **描述：** 数据项插图

##### children

- **类型：** `ItemDatum[]`
- **可选**
- **描述：** 子数据项（用于层级结构）

---

### ResourceConfig

资源配置对象。

```typescript
interface ResourceConfig {
  url: string;
  format?: 'svg' | 'png' | 'jpg' | 'jpeg' | 'gif';
  [key: string]: any;
}
```

---

### DesignOptions

设计配置选项。

```typescript
interface DesignOptions {
  title?: string | TitleConfig;
  structure?: string | StructureConfig;
  item?: string | ItemConfig;
  items?: (string | ItemConfig)[];
}
```

#### 属性

##### title

- **类型：** `string | TitleConfig`
- **可选**
- **描述：** 标题组件配置

**字符串形式：**

```typescript
design: {
  title: 'default'; // 使用默认标题组件
}
```

**对象形式：**

```typescript
design: {
  title: {
    type: 'default',
    alignHorizontal: 'center',
    fontSize: 24
  }
}
```

##### structure

- **类型：** `string | StructureConfig`
- **可选**
- **描述：** 结构组件配置

**内置结构：**

- **列表结构：** `list-column`, `list-row`, `list-grid`, `list-waterfall`, `list-sector`
- **对比结构：** `compare-left-right`, `compare-mirror`, `compare-hierarchy-row`, `compare-hierarchy-left-right`
- **顺序结构：** `sequence-timeline`, `sequence-steps`, `sequence-ascending-steps`, `sequence-snake-steps`, `sequence-color-snake-steps`, `sequence-roadmap-vertical`, `sequence-horizontal-zigzag`
- **层级结构：** `hierarchy-tree`, `hierarchy-pyramid`
- **关系结构：** `relation-circle`, `relation-network`
- **统计图：** `quadrant`

**示例：**

```typescript
design: {
  structure: 'list-column'
}

// 或带参数
design: {
  structure: {
    type: 'list-column',
    gap: 30,
    width: 400
  }
}
```

##### item

- **类型：** `string | ItemConfig`
- **可选**
- **描述：** 数据项组件配置

**内置数据项：**

- **卡片类：** `badge-card`, `compact-card`, `progress-card`, `ribbon-card`, `rounded-rect-node`, `candy-card-lite`, `l-corner-card`, `letter-card`, `quarter-simple-card`
- **徽章类：** `icon-badge`, `pill-badge`
- **图表类：** `chart-column`, `circular-progress`, `quarter-circular`
- **箭头类：** `horizontal-icon-arrow`, `vertical-icon-arrow`, `simple-horizontal-arrow`, `simple-vertical-arrow`, `horizontal-icon-line`
- **形状类：** `circle-node`, `pyramid`
- **文本类：** `plain-text`, `bullet-text`, `done-list`
- **其他：** `simple-item`, `simple-illus-item`

**示例：**

```typescript
design: {
  item: 'badge-card'
}

// 或带参数
design: {
  item: {
    type: 'badge-card',
    width: 300,
    height: 100,
    iconSize: 32,
    valueFormatter: (value) => `${value}%`
  }
}
```

##### items

- **类型：** `(string | ItemConfig)[]`
- **可选**
- **描述：** 多级数据项组件配置，用于层级结构需要多级数据项样式的场景

**示例：**

```typescript
design: {
  items: [
    'badge-card',
    { type: 'progress-card', width: 250 },
    'icon-badge',
  ];
}
```

---

### ThemeConfig

主题配置。

```typescript
interface ThemeConfig {
  colorPrimary?: string;
  colorPrimaryBg?: string;
  colorPrimaryText?: string;
  colorText?: string;
  colorTextSecondary?: string;
  colorWhite?: string;
  colorBg?: string;
  colorBgElevated?: string;
  fontFamily?: string;
  fontSize?: number;
  stylize?: 'rough' | 'pattern' | 'gradient';
  palette?: string;
}
```

#### 属性

##### colorPrimary

- **类型：** `string`
- **可选**
- **描述：** 主色调

##### colorPrimaryBg

- **类型：** `string`
- **可选**
- **描述：** 主色浅色背景

##### colorPrimaryText

- **类型：** `string`
- **可选**
- **描述：** 主色背景上的文本颜色

##### colorText

- **类型：** `string`
- **可选**
- **描述：** 主要文本颜色

##### colorTextSecondary

- **类型：** `string`
- **可选**
- **描述：** 次要文本颜色

##### colorWhite

- **类型：** `string`
- **可选**
- **描述：** 纯白色

##### colorBg

- **类型：** `string`
- **可选**
- **描述：** 背景色

##### colorBgElevated

- **类型：** `string`
- **可选**
- **描述：** 卡片背景色

##### fontFamily

- **类型：** `string`
- **可选**
- **描述：** 字体家族

**示例：**

```typescript
fontFamily: 'Arial, Helvetica, sans-serif';
```

##### fontSize

- **类型：** `number`
- **可选**
- **描述：** 基础字号（像素）

##### stylize

- **类型：** `'rough' | 'pattern' | 'gradient'`
- **可选**
- **描述：** 风格化效果

**选项：**

- `rough`: 手绘风格
- `pattern`: 图案填充
- `gradient`: 渐变效果

##### palette

- **类型：** `string`
- **可选**
- **描述：** 调色板名称

---

## 类型定义

### ThemeColors

完整的主题颜色配置（包含所有生成的颜色）。

```typescript
interface ThemeColors {
  colorPrimary: string;
  colorPrimaryBg: string;
  colorPrimaryText: string;
  colorText: string;
  colorTextSecondary: string;
  colorWhite: string;
  colorBg: string;
  colorBgElevated: string;
}
```

### BaseItemProps

数据项组件的基础属性。

```typescript
interface BaseItemProps {
  x?: number;
  y?: number;
  id?: string;
  indexes: number[];
  data: Data;
  datum: ItemDatum;
  themeColors: ThemeColors;
  positionH?: 'normal' | 'center' | 'flipped';
  positionV?: 'normal' | 'center' | 'flipped';
  valueFormatter?: (value: number) => string | number;
  [key: string]: any;
}
```

### BaseStructureProps

结构组件的基础属性。

```typescript
interface BaseStructureProps {
  Title?: ComponentType<Pick<TitleProps, 'title' | 'desc'>>;
  Item: ComponentType<Omit<BaseItemProps, 'themeColors'>>;
  data: Data;
  [key: string]: any;
}
```

---

## 工具函数

### parseSVG()

```typescript
function parseSVG(svg: string): SVGSVGElement | null;
```

将 SVG 字符串解析为 SVG 元素。

**参数：**

- `svg` - SVG 字符串

**返回值：**

- `SVGSVGElement | null` - SVG 元素或 null（解析失败时）

**示例：**

```typescript
import { parseSVG } from '@antv/infographic';

const svgElement = parseSVG('<svg>...</svg>');
if (svgElement) {
  document.body.appendChild(svgElement);
}
```

---

### getItemId()

```typescript
function getItemId(
  indexes: number[],
  type: 'static' | 'shape' | 'def' | 'shapes-group',
  appendix?: string,
): string;
```

生成数据项元素的唯一 ID。

**参数：**

- `indexes` - 数据项索引数组
- `type` - 元素类型
- `appendix` - 可选的附加字符串

**返回值：**

- `string` - 生成的 ID

**示例：**

```typescript
import { getItemId } from '@antv/infographic';

const id = getItemId([0, 1], 'shape', 'circle');
// 返回: "item-0-1-shape-circle"
```

---

### getItemProps()

```typescript
function getItemProps<T extends BaseItemProps>(
  props: T,
  customKeys: string[],
): [ExtractedProps, RestProps];
```

从 props 中提取指定的属性。

**参数：**

- `props` - 原始 props
- `customKeys` - 需要提取的自定义属性名数组

**返回值：**

- 返回一个元组 `[ExtractedProps, RestProps]`
  - `ExtractedProps`: 包含所有 BaseItemProps 和指定的自定义属性
  - `RestProps`: 剩余的 props

**示例：**

```typescript
import { getItemProps } from '@antv/infographic';

const [{ datum, indexes, width, height }, restProps] = getItemProps(props, [
  'width',
  'height',
]);
```

---

## 注册器

### registerTheme()

```typescript
function registerTheme(name: string, config: ThemeSeed): void;
```

注册自定义主题。

**参数：**

- `name` - 主题名称
- `config` - 主题种子配置

**示例：**

```typescript
import { registerTheme } from '@antv/infographic';

registerTheme('my-theme', {
  seed: {
    colorPrimary: '#722ed1',
    fontFamily: 'Georgia, serif',
  },
});
```

---

### getTheme()

```typescript
function getTheme(name: string): ThemeConfig | undefined;
```

获取已注册的主题。

**参数：**

- `name` - 主题名称

**返回值：**

- `ThemeConfig | undefined` - 主题配置或 undefined

---

### getThemes()

```typescript
function getThemes(): string[];
```

获取所有已注册的主题名称。

**返回值：**

- `string[]` - 主题名称数组

---

### registerTemplate()

```typescript
function registerTemplate(name: string, options: TemplateOptions): void;
```

注册自定义模板。

**参数：**

- `name` - 模板名称
- `options` - 模板配置选项

**示例：**

```typescript
import { registerTemplate } from '@antv/infographic';

registerTemplate('my-template', {
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
  theme: 'default',
});
```

---

### getTemplate()

```typescript
function getTemplate(name: string): ParsedTemplateOptions | undefined;
```

获取已注册的模板。

**参数：**

- `name` - 模板名称

**返回值：**

- `ParsedTemplateOptions | undefined` - 模板配置或 undefined

---

### getTemplates()

```typescript
function getTemplates(): string[];
```

获取所有已注册的模板名称。

**返回值：**

- `string[]` - 模板名称数组

---

### registerResourceLoader()

```typescript
function registerResourceLoader(format: string, loader: ResourceLoader): void;
```

注册自定义资源加载器。

**参数：**

- `format` - 资源格式
- `loader` - 加载器函数

**示例：**

```typescript
import { registerResourceLoader } from '@antv/infographic';

registerResourceLoader('custom', async (config, options) => {
  // 自定义加载逻辑
  return {
    href: '...',
    // ...
  };
});
```

---

### loadSVGResource()

```typescript
function loadSVGResource(
  url: string,
  options?: ResourceLoadOptions,
): Promise<string>;
```

加载 SVG 资源。

**参数：**

- `url` - SVG 资源 URL
- `options` - 加载选项

**返回值：**

- `Promise<string>` - SVG 字符串

**示例：**

```typescript
import { loadSVGResource } from '@antv/infographic';

const svgString = await loadSVGResource('https://example.com/icon.svg');
```

---

## 扩展开发

### 自定义数据项组件

详见 [数据项开发指南](./src/designs/items/prompt.md)

### 自定义结构组件

详见 [结构开发指南](./src/designs/structures/prompt.md)

---

## 更多资源

- [入门教程](./tutorial.md)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈](https://github.com/antvis/infographic/issues)
