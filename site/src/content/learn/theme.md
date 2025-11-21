---
title: 主题
---

AntV Infographic 中主题提供以下能力：

- 配置颜色及色板（如：主色、色板、背景色等）
- 针对信息图中特定部分（如：文本、图形等）进行样式调整
- 风格化配置

主题在配置中可以通过 `options.theme` 和 options.[themeConfig](/reference/types#theme-config) 进行配置，
其中 `options.theme` 用于指定已经注册的主题名称，`options.themeConfig` 用于对主题进行更细粒度的配置和覆盖。

## 主色及背景色 {#color-primary-and-bg}

主题配置中 `colorPrimary` 和 `colorBg` 用于指定信息图的主色和背景色。主色通常用于数据项无关的装饰性元素，如图标、连接线等，当没有配置色板时，数据项会将主色作为默认颜色。

下面的示例中，使用了默认主色 <span style={{background: '#FF356A',color: '#fff', borderRadius: 4}}>&nbsp;#FF356A&nbsp;</span> ，背景色为白色。

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

下面的示例中，使用了自定义主色 <span style={{background: '#61DDAA',color: '#fff', borderRadius: 4}}>&nbsp;#61DDAA&nbsp;</span> ，背景色为暗色 <span style={{background: '#1F1F1F',color: '#fff', borderRadius: 4}}>&nbsp;#1F1F1F&nbsp;</span> 。

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "theme": "dark",
  "themeConfig": {
    "colorPrimary": "#61DDAA",
    "colorBg": "#1F1F1F"
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

## 色板 {#palette}

色板用于为数据项指定颜色集合，通常用于区分不同的数据类别。可以通过 `themeConfig.palette` 来配置色板。

色板类型定义见[Palette](/reference/types#palette)，其支持 `string`、`string[]` 和函数类型。

传入 `string` 时，表示使用[内置](/reference/built-in-palettes)或者[自定义](/learn/custom-palette)的色板名称，下面的示例中，使用了内置的 AntV 色板。

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "themeConfig": {
    "palette": "antv"
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

传入 `string[]` 时，表示使用指定的颜色数组作为色板，下面的示例中使用了三个颜色作为色板。

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "themeConfig": {
    "palette": ["#61DDAA", "#F6BD16", "#F08BB4"]
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

<Note>

当数据项数量超过色板长度时，会循环使用色板中的颜色。例如，色板中有 3 种颜色，而数据项有 5 个，则第 4 个数据项会使用色板中的第 1 种颜色，第 5 个数据项会使用色板中的第 2 种颜色。

</Note>

传入函数时，类似于 D3 的[颜色生成函数](https://d3js.org/d3-interpolate)，可以根据数据动态生成颜色，下面的示例中，使用了一个简单的颜色生成函数，根据数据项的索引和总数生成渐变色。

<CodeRunner>

```js
import {Infographic} from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  template: 'list-row-simple-horizontal-arrow',
  themeConfig: {
    palette: (ratio, index, count) => {
      // 从蓝色到绿色的渐变
      const hue = Math.floor(ratio * 120 + 180); // 180-300度
      const saturation = 75;
      const lightness = 55;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    },
  },
  data: {
    items: [
      {label: '步骤 1', desc: '开始'},
      {label: '步骤 2', desc: '进行中'},
      {label: '步骤 3', desc: '完成'},
    ],
  },
});

infographic.render();
```

</CodeRunner>

## 特定部分样式 {#specific-style}

`themeConfig` 中以下配置项用于对信息图中特定部分进行样式调整：

| 配置项        | 说明                    |
| ------------- | ----------------------- |
| base.`global` | 配置全局图形样式        |
| base.`text`   | 配置全局字体样式        |
| base.`shape`  | 配置全局`shape`图形样式 |
| title         | 信息图标题样式          |
| desc          | 信息图描述样式          |
| shape         | `shape`图形样式         |
| item.`icon`   | 数据项图标样式          |
| item.`label`  | 数据项标题样式          |
| item.`desc`   | 数据项描述样式          |
| item.`value`  | 数据项数值样式          |

<Note>
  `shape图形` 指在自定义`结构`、`数据项`时，配置了 `data-element-type="shape"`
  参数的图形。
</Note>

下面的例子中将背景色改为暗色，并调整了全局字体为手写字体，数据项标题颜色设置为 <span style={{background: '#FF356A',color: '#fff', borderRadius: 4}}>&nbsp;#FF356A&nbsp;</span>。

<Infographic>

```json
{
  "template": "list-row-horizontal-icon-arrow",
  "theme": "dark",
  "themeConfig": {
    "colorBg": "#1F1F1F",
    "base": {
      "text": {
        "font-family": "851tegakizatsu"
      }
    },
    "item": {
      "label": {
        "fill": "#FF356A"
      }
    }
  },
  "data": {
    "items": [
      {
        "label": "步骤 1",
        "desc": "开始",
        "icon": "icon:mdi/rocket-launch"
      },
      {
        "label": "步骤 2",
        "desc": "进行中",
        "icon": "icon:mdi/progress-clock"
      },
      {
        "label": "步骤 3",
        "desc": "完成",
        "icon": "icon:mdi/trophy"
      }
    ]
  }
}
```

</Infographic>

## 风格化配置 {#stylize}

风格化是指将信息图中的图形元素应用特定的视觉效果，以增强信息图的视觉吸引力和表达力。AntV Infographic 提供了一些内置的风格化类型，可以通过 `themeConfig.stylize` 进行配置。

常用的风格化类型包括：

- [rough](/reference/types#rough-config)：应用手绘风格，使图形看起来像是手工绘制的。
- [pattern](/reference/types#pattern-config)：应用图案填充，为图形添加重复的图案效果。
- [linear-gradient](/reference/types#linear-gradient-config) / [radial-gradient](/reference/types#radial-gradient-config)：应用渐变填充，为图形添加线性或径向渐变效果。

通过 `themeConfig.stylize.type` 指定风格化类型，并通过 `themeConfig.stylize` 传入对应的配置参数。

下面的示例中分别展示了这几种风格化效果：

**手绘风格(rough)**：

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "themeConfig": {
    "stylize": {
      "type": "rough"
    }
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

**图案填充(pattern)**：

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "themeConfig": {
    "stylize": {
      "type": "pattern",
      "pattern": "line"
    }
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>

**渐变填充(linear-gradient)**：

<Infographic>

```json
{
  "template": "list-row-simple-horizontal-arrow",
  "themeConfig": {
    "stylize": {
      "type": "linear-gradient"
    }
  },
  "data": {
    "items": [
      {"label": "步骤 1", "desc": "开始"},
      {"label": "步骤 2", "desc": "进行中"},
      {"label": "步骤 3", "desc": "完成"}
    ]
  }
}
```

</Infographic>
