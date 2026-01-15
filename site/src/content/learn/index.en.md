---
title: Quick Start
---

## Installation {#installation}

Install [@antv/infographic](https://www.npmjs.com/package/@antv/infographic) via npm:

```bash
npm install @antv/infographic --save
```

## Usage {#usage}

The following example shows how to instantiate and render a list-type infographic:

<CodeRunner>

```js
import {Infographic} from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
});

const syntax = `infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete`;

infographic.render(syntax);
```

</CodeRunner>

Key configuration options:

- `container`: Selector or node for the rendering container
- `width` / `height`: Infographic width and height, can use percentage or pixels
- `syntax`: [Infographic Syntax](/learn/infographic-syntax)

### Using in HTML {#using-in-html}

You can also include it directly in HTML via CDN:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Infographic Demo</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="https://unpkg.com/@antv/infographic@latest/dist/infographic.min.js"></script>
    <script>
      const {Infographic} = AntVInfographic;
      const infographic = new Infographic({
        container: '#container',
        width: '100%',
        height: '100%',
      });

      const syntax = `
        infographic list-row-simple-horizontal-arrow
        data
          lists
            - label Step 1
              desc Start
            - label Step 2
              desc In Progress
            - label Step 3
              desc Complete
        `;

      infographic.render(syntax);
    </script>
  </body>
</html>
```

### Using in React {#using-in-react}

In React, you can create an instance in `useEffect` and mount it to a `ref`:

```jsx
import React, {useEffect, useRef} from 'react';
import {Infographic} from '@antv/infographic';

export function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const infographic = new Infographic({
      container: containerRef.current,
      width: '100%',
      height: '100%',
    });

    infographic.render(`
      infographic list-row-simple-horizontal-arrow
          data
            lists
              - label Step 1
                desc Start
              - label Step 2
                desc In Progress
              - label Step 3
                desc Complete
    `);

    return () => {
      infographic.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}
```

### Using in Vue {#using-in-vue}

In Vue 3, you can create an instance in the `onMounted` lifecycle hook and mount it to a `ref`:

```vue
<template>
  <div ref="containerRef"></div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {Infographic} from '@antv/infographic';

const containerRef = ref(null);
let infographic = null;

onMounted(() => {
  infographic = new Infographic({
    container: containerRef.value,
    width: '100%',
    height: '100%',
  });

  infographic.render(`
    infographic list-row-simple-horizontal-arrow
    data
      lists
        - label Step 1
          desc Start
        - label Step 2
          desc In Progress
        - label Step 3
          desc Complete
  `);
});

onBeforeUnmount(() => {
  if (infographic) {
    infographic.destroy();
  }
});
</script>
```

### Server-Side Rendering {#server-side-rendering}

Using the `renderToString` method provided by `@antv/infographic/ssr`, you can render infographics in non-browser environments and output SVG strings:

```js
import { renderToString } from '@antv/infographic/ssr';

const syntax = `infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete`;

const svg = await renderToString(syntax);
```
