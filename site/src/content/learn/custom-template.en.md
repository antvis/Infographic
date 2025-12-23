---
title: Custom Templates
---

> If you're not familiar with the template concept, see [Core Concepts - Templates](/learn/template)

After registering a custom template with [registerTemplate](/reference/infographic-exports#register-template), you can use it in infographic syntax.

```js
import {registerTemplate, Infographic} from '@antv/infographic';

// Register custom template
registerTemplate('custom-template', {
  design: {
    structure: 'sequence-horizontal-zigzag',
    item: 'underline-text',
  },
});

const infographic = new Infographic({
  // Other configuration options...
});

infographic.render(`
infographic custom-template
`);
```

Abstracting designs into templates allows teams to share unified layouts and styles, and directly reuse them in subsequent projects.
