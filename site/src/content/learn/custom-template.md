---
title: 自定义模版
---

> 如果你不了解模版的概念，可以查看[核心概念-模版](/learn/template)

通过 [registerTemplate](/reference/infographic-exports#register-template) 方法可以注册自定义模版，从而在信息图中使用。

```js
import {registerTemplate, Infographic} from '@antv/infographic';

// 注册自定义模版
registerTemplate('custom-template', {
  design: {
    structure: 'sequence-horizontal-zigzag',
    item: 'underline-text',
  },
});

const infographic = new Infographic({
  // 其他配置项...
  template: 'custom-template', // 使用自定义模版
});
```
