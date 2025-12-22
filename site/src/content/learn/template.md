---
title: 模板
---

除了自由组合设计外，AntV Infographic 也支持直接复用设计好的信息图模板，快速用数据填充并生成信息图。

将一套设计配置注册为 `模板`（Template）后，便可复用。你可以直接使用内置模板，也可以注册自己的模板供后续调用。

广义上，模板是[信息图语法的子集](/reference/infographic-types#template-options)，但多数场景只需预置 `design`，将 `theme`、`themeConfig` 留给使用者调整。

使用 [registerTemplate](/reference/infographic-exports#register-template) 注册后，即可在语法入口行调用模板。以下两种写法**等价**：

1. 直接通过 `design` 配置结构与数据项：

```syntax
design
  structure list-row
  item simple
```

2. 注册并引用模板：

```js
import {registerTemplate} from '@antv/infographic';

registerTemplate('simple-list', {
  design: {
    structure: 'list-row',
    item: 'simple',
  },
});
```

然后在语法中这样使用：

```syntax
infographic simple-list
```

AntV Infographic 内置了一些常用的模板，详情请见[内置模板](/reference/built-in-templates)。
