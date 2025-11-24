---
title: 入门指南
---

信息图通过视觉语言压缩文字信息，让读者用最短时间抓住重点。本节在快速上手的基础上，补充完整的配置示例与要点说明。

下面是一个包含自定义设计、主题和资源加载的完整示例：

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

代码说明：

- **资源加载器**：通过 `registerResourceLoader` 从 Iconify 按需拉取 SVG。
- **设计**：`design` 字段自定义标题、结构与数据项类型及参数。
- **主题**：切换暗色主题并用 `themeConfig` 配置色板、字体、风格化。
- **数据**：传入标题与数据项（标签、描述、时间、图标）。

这里没有使用 `template` 字段，而是直接给出设计配置。可以把模板理解为一组预置的 `design` 与主题组合，便于快捷调用。

更多细节可继续阅读：

- [信息图语法](/learn/infographic-syntax)
- [核心概念-资源](/learn/resources)
- [核心概念-数据](/learn/data)
- [核心概念-主题](/learn/theme)
- [核心概念-设计](/learn/design)
