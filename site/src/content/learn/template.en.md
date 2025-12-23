---
title: Templates
---

In addition to freely combining designs, AntV Infographic also supports directly reusing pre-designed infographic templates to quickly populate data and generate infographics.

After registering a design configuration set as a `Template`, it can be reused. You can directly use built-in templates or register your own templates for later use.

Broadly speaking, a template is a [subset of infographic syntax](/reference/infographic-types#template-options), but in most scenarios, you only need to preset `design`, leaving `theme` and `themeConfig` for users to adjust.

After registering with [registerTemplate](/reference/infographic-exports#register-template), you can call the template in the syntax entry line. The following two approaches are **equivalent**:

1. Configure structure and items directly through `design`:

```syntax
design
  structure list-row
  item simple
```

2. Register and reference a template:

```js
import {registerTemplate} from '@antv/infographic';

registerTemplate('simple-list', {
  design: {
    structure: 'list-row',
    item: 'simple',
  },
});
```

Then use it in the syntax like this:

```syntax
infographic simple-list
```

AntV Infographic has some built-in commonly used templates. See [Built-in Templates](/reference/built-in-templates) for details.
