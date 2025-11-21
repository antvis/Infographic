---
title: 自定义主题
---

主题在 AntV Infographic 主要用于配置信息图的样式、风格等。

如果你还不了解主题的概念，可以先阅读[核心概念-主题](/learn/theme)。

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

> 具体的主题配置项可以参考[核心概念-主题](/learn/theme)。

## 注册主题 {#注册主题}

对于一些比较通用的主题，可以注册之后便于复用，通过 `registerTheme` 来注册主题：

```js
import {registerTheme} from '@antv/infographic';

registerTheme('my-theme', {
  // 主题配置项
});
```
