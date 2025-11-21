---
title: 快速开始
---

## 安装 {#安装}

AntV Infographic 提供了 [npm 包](https://www.npmjs.com/package/@antv/infographic)，可通过以下方式进行安装：

<TerminalBlock>npm install @antv/infographic --save</TerminalBlock>

## 使用 {#使用}

下面是一个简单的示例，展示如何使用 AntV Infographic 创建一个基本的信息图：

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

上面的例子中我们从 `@antv/infographic` 包中导入了 `Infographic` 类，在实例化阶段传入了配置项，包括：

- `container`：指定渲染容器的选择器。
- `width` 和 `height`：设置信息图的宽度和高度。
- `template`：选择内置信息图的模板。
- `data`：提供渲染所需的数据。

然后调用 `render` 方法进行渲染。

### 在 HTML 中使用 {#在-html-中使用}

要在 HTML 中直接使用 AntV Infographic，可以通过 CDN 引入相关脚本和样式：

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

如果你使用 React，可以通过以下方式集成 AntV Infographic：

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
