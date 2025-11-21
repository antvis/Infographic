---
title: 入门指南
---

信息图是一种将复杂信息转化为可视化图形的表达方式，其核心价值是通过视觉语言替代文字，起到快速传达关键信息的作用。

在上一节你已经了解如何创建一个内置信息图，现在我们介绍一些信息图的基本概念以及 `AntV Infographic` 的使用方法。

下面为一个完整的信息图示例：

<CodeRunner>

```js
import {
  Infographic,
  registerResourceLoader,
  loadSVGResource,
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const {data} = config;
  const res = await fetch(`https://api.iconify.design/${data}.svg`);
  const text = await res.text();
  return loadSVGResource(text);
});

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  design: {
    title: {
      type: 'default',
      width: 300,
    },
    structure: {
      type: 'list-row',
      gap: 0,
      zigzag: true,
    },
    item: {
      type: 'horizontal-icon-arrow',
    },
  },
  theme: 'dark',
  themeConfig: {
    palette: ['#61DDAA', '#F6BD16', '#F08BB4'],
    base: {
      text: {
        'font-family': '851tegakizatsu',
      },
    },
    stylize: {
      type: 'rough',
    },
  },
  data: {
    title: '计划进展',
    items: [
      {
        label: '步骤 1',
        desc: '开始',
        time: 'Last Day',
        icon: 'mdi/rocket-launch',
      },
      {
        label: '步骤 2',
        desc: '进行中',
        time: 'Today',
        icon: 'mdi/progress-clock',
      },
      {label: '步骤 3', desc: '完成', time: 'Tomorrow', icon: 'mdi/trophy'},
    ],
  },
});

infographic.render();
```

</CodeRunner>

这段示例使用了以下特性：

- **资源加载器**：通过 `registerResourceLoader` 注册一个资源加载器，用于从 Iconify 图标库加载 SVG 图标。
- **信息图实例**：使用 `Infographic` 类创建一个信息图实例
- **设计**：通过 `design` 属性定义信息图的布局和组成部分，包括标题、结构和数据项类型及参数配置。
- **主题**：通过 `theme` 切换为暗色主题，并通过 `themeConfig` 自定义色板、字体和风格化效果。
- **数据**：通过 `data` 传入信息图数据，并提供标题和数据项，其中数据项包含标题(label)、描述(desc)、时间(time)和图标(icon)字段。

在这个例子中没有通过 `template` 指定模版，而是通过 `design` 进行自定义，可以把模版理解为内置的一套 `design` 配置，AntV Infographic 中许多可注册的内容都是类似的逻辑，例如色板、主题。

如果你想了解关于完整的配置项细节，请继续阅读下一节[《信息图语法》](/infographic-syntax)。

关于资源及资源加载器的更多信息，请参考：[核心概念-资源](/core-concepts/resources)。
关于数据的更多信息，请参考：[核心概念-数据](/core-concepts/data)。
关于主题的更多信息，请参考：[核心概念-主题](/core-concepts/theme)。
关于信息图设计的更多信息，请参考：[核心概念-设计](/core-concepts/design)。
