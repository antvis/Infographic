---
title: 快速开始
---

## 安装 {#安装}

通过 npm 安装 [@antv/infographic](https://www.npmjs.com/package/@antv/infographic)：

```bash
npm install @antv/infographic --save
```

## 使用 {#使用}

下面的示例展示如何实例化并渲染一张列表型信息图：

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
  items
    - label 步骤 1
      desc 开始
    - label 步骤 2
      desc 进行中
    - label 步骤 3
      desc 完成`;

infographic.render(syntax);
```

</CodeRunner>

关键配置说明：

- `container`：渲染容器的选择器或节点
- `width` / `height`：信息图宽高，可用百分比或像素
- `syntax`：[信息图语法](/learn/infographic-syntax)

### 在 HTML 中使用 {#在-html-中使用}

也可以通过 CDN 直接在 HTML 中引入：

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
          items
            - label 步骤 1
              desc 开始
            - label 步骤 2
              desc 进行中
            - label 步骤 3
              desc 完成
        `;

      infographic.render(syntax);
    </script>
  </body>
</html>
```

### 在 React 中使用 {#在-react-中使用}

在 React 中，可在 `useEffect` 中创建实例并挂载到 `ref`：

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
            items
              - label 步骤 1
                desc 开始
              - label 步骤 2
                desc 进行中
              - label 步骤 3
                desc 完成
    `);

    return () => {
      infographic.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}
```

### 在 Vue 中使用 {#在-vue-中使用}

在 Vue 3 中，可在 `onMounted` 生命周期中创建实例并挂载到 `ref`：

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
      items
        - label 步骤 1
          desc 开始
        - label 步骤 2
          desc 进行中
        - label 步骤 3
          desc 完成
  `);
});

onBeforeUnmount(() => {
  if (infographic) {
    infographic.destroy();
  }
});
</script>
```

### 在 Node.js 中使用（非浏览器中渲染） {#在-node-js-中使用-非浏览器中渲染}

在 Node.js 环境中（如 SSR，以及给AI用的MCP、SKILLs等），可以使用 `ssr` 模块将信息图渲染为 SVG 字符串：

```ts
import { renderToSVG } from '@antv/infographic/ssr';

async function renderInfographic() {
  const result = await renderToSVG({
    input: `
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: 步骤 1
      desc: 开始
    - label: 步骤 2
      desc: 进行中
    - label: 步骤 3
      desc: 完成
`,
  });

  console.log(result.svg);
  console.log('Errors:', result.errors);
  console.log('Warnings:', result.warnings);
}

renderInfographic();
```

详见 [Non-Browser Rendering](/reference/non-browser-rendering)。
