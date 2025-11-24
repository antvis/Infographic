---
title: 自定义模板
---

> 如果你不了解模板的概念，可以查看[核心概念-模板](/learn/template)

通过 [registerTemplate](/reference/infographic-exports#register-template) 注册自定义模板后，便可在信息图语法中使用。

```js
import {registerTemplate, Infographic} from '@antv/infographic';

// 注册自定义模板
registerTemplate('custom-template', {
  design: {
    structure: 'sequence-horizontal-zigzag',
    item: 'underline-text',
  },
});

const infographic = new Infographic({
  // 其他配置项...
  template: 'custom-template', // 使用自定义模板
});
```

将设计抽象为模板，能让团队共享统一的布局与样式，并在后续项目中直接复用。
