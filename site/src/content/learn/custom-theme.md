---
title: 自定义主题
---

主题用于配置信息图的全局样式与风格。如需概念回顾，请先阅读[核心概念-主题](/learn/theme)。

## 配置主题 {#配置主题}

对于简单的主题配置，可以直接在创建信息图时传入配置项：

```js
const infographic = new Infographic({
  // 其他配置项...
  themeConfig: {
    // 主题配置项
  },
});
```

> 完整配置项参考[核心概念-主题](/learn/theme)。

## 注册主题 {#注册主题}

对于一些比较通用的主题，可以注册之后便于复用，通过 `registerTheme` 来注册主题：

```js
import {registerTheme} from '@antv/infographic';

registerTheme('my-theme', {
  // 主题配置项
});
```

注册后即可在实例化时通过 `theme: 'my-theme'` 引用，配合 `themeConfig` 进一步调整。
