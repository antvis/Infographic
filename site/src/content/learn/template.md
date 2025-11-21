---
title: 模版
---

AntV Infographic 允许用户通过信息图语法灵活的组合出丰富多样的信息图，但对于一些用户来说，他们的目标并非自行进行设计，而是将已经设计好的信息图模版填充进准备好的数据中，从而快速生成信息图。

因此 AntV Infographic 支持将组合好的设计配置项进行注册便于复用，称为`模版`（Template）。用户可以通过内置的模版快速生成常见的信息图设计，也可以将自己设计好的信息图模版进行注册，便于后续使用。

广义上来说模版可以是[信息图语法的子集](/reference/types#template-options)，因此它可以相当灵活。不过在大多数实践中，我们通常只会配置 `options.design` 部分，而将 `theme`、`themeConfig` 等留给用户自行发挥。

模版可以通过 `registerTemplate` 方法进行[注册](/learn/custom-template#register)，注册后即可通过 `template` 字段进行调用，以下两种写法是**等价**的：

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

2. 注册并使用模版：

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

AntV Infographic 内置了一些常用的模版，详情请见[内置模版](/reference/built-in-templates)。
