---
title: 信息图语法
---

我们将通过 `new Infographic` 创建信息图时传入的配置项称为信息图语法，因为相比于传统的配置项，更像是一种描述信息图的“语言”，通过描述结构、布局、设计来组装出一个完整的信息图，但在具体实现上，我们仍然将其称之为 `InfographicOptions` 而非 `InfographicSyntax`，便于与现有的代码体系保持一致。

信息图语法受到 AntV G2 和 AntV G6 的图形语法的启发，并结合了[信息图理论](/learn/infographic-theory)及相关[设计原则](/learn/infographic-design)，旨在简化信息图的创建过程，使用户能够更专注于内容和设计，而无需深入了解底层实现细节。

我们将信息图表示为：<b><i>信息图 = 信息结构 + 图形表意</i></b>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ir9aTL5mKQYAAAAARVAAAAgAemJ7AQ/original"
  width="50%"
/>

其中信息结构可以认为是`数据`的抽象表达，决定了信息图的内容和层次。

图形表意则是`设计`的抽象表达，决定了信息图的视觉呈现和风格。

## InfographicOptions {#infographic-options}

信息图语法主要包含以下配置项：

| 属性        | 类型                    | 必填   | 说明                                   | 引用                                             |
| ----------- | ----------------------- | ------ | -------------------------------------- | ------------------------------------------------ |
| container   | `string \| HTMLElement` | 否     | 容器，可以是选择器或者 HTMLElement     | -                                                |
| width       | `number \| string`      | 否     | 宽度，支持数字（像素值）或者百分比形式 | -                                                |
| height      | `number \| string`      | 否     | 高度，支持数字（像素值）或者百分比形式 | -                                                |
| padding     | `Padding`               | 否     | 容器内边距                             | [Padding](/reference/types#padding)              |
| template    | `string`                | 否     | 模板                                   | -                                                |
| design      | `DesignOptions`         | 否     | 设计                                   | [DesignOptions](/reference/types#design-options) |
| data        | `Data`                  | **是** | 数据                                   | [Data](/reference/types#data)                    |
| theme       | `string`                | 否     | 主题                                   | -                                                |
| themeConfig | `ThemeConfig`           | 否     | 额外主题配置                           | [ThemeConfig](/reference/types#theme-config)     |
| svg         | `SVGOptions`            | 否     | svg 容器上的配置                       | [SVGOptions](/reference/types#svg-options)       |
