---
title: 主题
---

主题控制信息图的全局观感，提供能力包括：

- 配置主色、色板、背景等
- 针对文本、图形等特定部位调样式
- 应用风格化效果

可通过 `options.theme` 和 [options.themeConfig](/reference/infographic-types#theme-config) 进行配置：前者指定已注册主题名，后者做细粒度覆写。

## 主色及背景色 {#color-primary-and-bg}

`colorPrimary` / `colorBg` 决定主色与背景色。主色常用于装饰元素（如图标、连接线），未配置色板时也会作为数据项默认色。

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

色板为数据项提供颜色集合，常用于区分类别。通过 `themeConfig.palette` 配置。

色板类型定义见[Palette](/reference/infographic-types#palette)，其支持 `string`、`string[]` 和函数类型。

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

风格化为图形添加特定效果，强化视觉吸引力。通过 `themeConfig.stylize` 选择内置风格并传入参数。

常用的风格化类型包括：

- [rough](/reference/infographic-types#rough-config)：应用手绘风格，使图形看起来像是手工绘制的。
- [pattern](/reference/infographic-types#pattern-config)：应用图案填充，为图形添加重复的图案效果。
- [linear-gradient](/reference/infographic-types#linear-gradient) / [radial-gradient](/reference/infographic-types#radial-gradient)：应用渐变填充，为图形添加线性或径向渐变效果。

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
