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
  template: 'list-row-simple-horizontal-arrow',
  data: {
    items: [
      {label: '步骤 1', desc: '开始'},
      {label: '步骤 2', desc: '进行中'},
      {label: '步骤 3', desc: '完成'},
    ],
  },
});

infographic.render();
```

</CodeRunner>

关键配置说明：

- `container`：渲染容器的选择器或节点
- `width` / `height`：信息图宽高，可用百分比或像素
- `template`：内置模板 ID
- `data`：用于渲染的标题与数据项

然后调用 `render` 方法进行渲染。

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
        template: 'list-row-simple-horizontal-arrow',
        data: {
          items: [
            {label: '步骤 1', desc: '开始'},
            {label: '步骤 2', desc: '进行中'},
            {label: '步骤 3', desc: '完成'},
          ],
        },
      });
      infographic.render();
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
      template: 'list-row-simple-horizontal-arrow',
      data: {
        items: [
          {label: '步骤 1', desc: '开始'},
          {label: '步骤 2', desc: '进行中'},
          {label: '步骤 3', desc: '完成'},
        ],
      },
    });

    infographic.render();
  }, []);

  return <div ref={containerRef} />;
}
```
