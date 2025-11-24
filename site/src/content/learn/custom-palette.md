---
title: 自定义色板
---

> 如果你不了解色板的概念，可以查看[核心概念-主题-色板](/learn/theme#palette)

通过 [registerPalette](/reference/infographic-exports#register-palette) 方法可以注册自定义色板，从而在信息图中使用。

```js
import {registerPalette, Infographic} from '@antv/infographic';

// 注册离散色板，即一个颜色字符串数组
registerPalette('discrete-palette', ['#FF356A', '#7BC9FF', '#FFD166']);

// 注册连续色板，即一个返回颜色字符串的函数
registerPalette('continuous-palette', (ratio) => {
  const r = Math.round(255 * ratio);
  const g = Math.round(200 * (1 - ratio));
  const b = 150;
  return `rgb(${r}, ${g}, ${b})`;
});

const infographic = new Infographic({
  // 其他配置项...
  themeConfig: {
    palette: 'discrete-palette', // 使用自定义色板
  },
});
```

自定义色板适用于品牌配色或特定业务配色，注册后即可在 `themeConfig.palette` 中按名称使用。
