---
title: 模板
---

除了自由组合设计外，AntV Infographic 也支持直接复用设计好的信息图模板，快速用数据填充并生成信息图。

将一套设计配置注册为 `模板`（Template）后，便可复用。你可以直接使用内置模板，也可以注册自己的模板供后续调用。

广义上，模板是[信息图语法的子集](/reference/infographic-types#template-options)，但多数场景只需预置 `options.design`，将 `theme`、`themeConfig` 留给使用者调整。

使用 [registerTemplate](/reference/infographic-exports#register-template) 注册后，即可在实例化时通过 `template` 字段调用。以下两种写法**等价**：

1. 通过 `design` 直接配置设计项：

```js
new Infographic({
  // 其他配置项...
  design: {
    structure: 'list-row',
    item: 'simple',
  },
});
```

2. 注册并使用模板：

```js
import {registerTemplate, Infographic} from '@antv/infographic';

registerTemplate('simple-list', {
  design: {
    structure: 'list-row',
    item: 'simple',
  },
});

new Infographic({
  // 其他配置项...
  template: 'simple-list',
});
```

AntV Infographic 内置了一些常用的模板，详情请见[内置模板](/reference/built-in-templates)。
