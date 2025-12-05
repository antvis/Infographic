---
title: 信息图语法
---

通过 `new Infographic()` 传入的配置项，就像一套描述信息图的“语言”：定义结构、设计、数据与主题，框架据此拼装出最终画面。我们在代码中仍使用 `InfographicOptions` 命名，便于与类型体系保持一致。

信息图语法受到 AntV G2、G6 的图形语法启发，并结合[信息图理论](/learn/infographic-theory)和[设计原则](/learn/infographic-design)。它的目标是让你专注于内容和视觉，不必陷入底层细节。

我们将信息图表示为：<Math>信息图 = 信息结构 + 图形表意</Math>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ir9aTL5mKQYAAAAARVAAAAgAemJ7AQ/original"
  width="50%"
/>

信息结构对应数据的抽象，决定内容与层级；图形表意对应设计的抽象，决定视觉呈现与风格。

## InfographicOptions {#infographic-options}

核心配置项如下：

| 属性        | 类型                    | 必填   | 说明                                   | 引用                                             |
| ----------- | ----------------------- | ------ | -------------------------------------- | ------------------------------------------------ |
| container   | `string \| HTMLElement` | 否     | 容器，可以是选择器或者 HTMLElement         | -                                                    |
| width       | `number \| string`      | 否     | 宽度，支持数字（像素值）或者百分比形式        | -                                                       |
| height      | `number \| string`      | 否     | 高度，支持数字（像素值）或者百分比形式        | -                                                        |
| padding     | `Padding`               | 否     | 容器内边距                             | [Padding](/reference/infographic-types#padding)     |
| template    | `string`                | 否     | 模板                                   | -                                                |
| design      | `DesignOptions`         | 否     | 设计                                   | [DesignOptions](/reference/infographic-types#design-options) |
| data        | `Data`                  | **是** | 数据                                   | [Data](/reference/infographic-types#data)                    |
| theme       | `string`                | 否     | 主题                                   | -                                                |
| themeConfig | `ThemeConfig`           | 否     | 额外主题配置                           | [ThemeConfig](/reference/infographic-types#theme-config)     |
| svg         | `SVGOptions`            | 否     | svg 容器上的配置                       | [SVGOptions](/reference/infographic-types#svg-options)       |
| editable    | `boolean`               | 否     | 是否开启编辑能力                        | -                                                     |
| plugins     | `IPlugin[]`             | 否     | 启用或自定义编辑器插件                  | [IPlugin](/reference/infographic-types#plugin)                  |
| interactions | `IInteraction[]`        | 否     | 启用或自定义编辑器交互                  | [IInteraction](/reference/infographic-types#interaction)        |
| elements    | `ElementProps[]`        | 否     | 用于向画布添加初始图形                  | [ElementProps](/reference/infographic-types#element-props)      |

常用搭配：

- `template`：直接复用内置或自定义模板
- `design`：覆盖或细化模板的结构、数据项、标题
- `theme`/`themeConfig`：切换主题或调整色板、字体、风格化
- `data`：填充标题与数据项，是唯一必填项
- 编辑能力：`editable` 设为 `true` 后，配合 `plugins`、`interactions` 定制编辑器工具，`elements` 可追加初始图形
