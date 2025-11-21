---
title: 原语节点
---

AntV Infographic 实现的 JSX Engine 提供了一组原语节点。与 SVG 节点不同，这类节点中的图形节点(`GraphicsElement`)具有相同的几何参数，即都通过 `x` `y` `width` `height` 等参数进行定位和尺寸控制，从而实现更统一的图形定义。

## 通用属性 {#common-props}

所有原语节点都接受 `BaseGeometryProps` 中的几何与 SVG 属性。常用参数如下：

| 参数        | 类型            | 默认值      | 说明                                                                                     |
| ----------- | --------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `x`         | `number`        | `undefined` | 元素左上角 X 坐标；部分元素会据此生成 `transform`。                                      |
| `y`         | `number`        | `undefined` | 元素左上角 Y 坐标。                                                                      |
| `width`     | `number`        | `undefined` | 元素宽度。                                                                               |
| `height`    | `number`        | `undefined` | 元素高度。                                                                               |
| `transform` | `string`        | `undefined` | 自定义变换。如果组件会自动生成 `transform`，则已生成的值会覆盖或跳过（见具体组件说明）。 |
| 其他        | `SVGAttributes` | -           | 与原生 SVG 元素一致，如 `fill`、`stroke`、`opacity`、`id`、`className`、`style` 等。     |
| `data-*`    | `any`           | -           | 自定义数据属性，便于调试或在运行时读取。                                                 |

## Defs {#defs}

`Defs` 用于定义引用对象，例如图案、阴影等，内部可以使用 JSX 原语节点、SVG 元素以及自定义组件进行定义。

| 参数       | 类型      | 默认值 | 说明                                                         |
| ---------- | --------- | ------ | ------------------------------------------------------------ |
| `children` | `JSXNode` | 必填   | 渐变、图案或滤镜等定义内容，需带 `id` 才能在其他节点中引用。 |

```jsx
<Defs>
  {/* 线性渐变 */}
  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#ff0000" />
    <stop offset="100%" stopColor="#0000ff" />
  </linearGradient>

  {/* 径向渐变 */}
  <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stopColor="#ffffff" />
    <stop offset="100%" stopColor="#000000" />
  </radialGradient>

  {/* 滤镜 */}
  <filter id="shadow">
    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" />
  </filter>
</Defs>

{/* 使用定义 */}
<Rect fill="url(#gradient1)" width={100} height={50} />
<Ellipse fill="url(#gradient2)" width={80} height={80} />
<Rect filter="url(#shadow)" width={100} height={50} />
```

`Defs` 中的声明对象通过 `id` 进行识别和引用，如果指定了多个声明对象 `id` 一致，那么后者会覆盖前者。

下面的示例中只有最后一次定义的 `def-1` 会出现在输出 SVG 中：

```jsx
<Defs>
  <linearGradient id="def-1">{/* ... */}</linearGradient>
  <linearGradient id="def-1">{/* ... */}</linearGradient>
</Defs>
```

## Group {#group}

`Group` 用于对一组图形进行分组，类似于 SVG 中的 `<g>` 元素。`Group` 支持 `x`、`y`、`width`、`height` 等定位和尺寸属性，用于控制其内部图形的布局。

当传入 `x` 或 `y` 时，会自动生成 `transform="translate(x, y)"`，便于整体平移组件。

| 参数       | 类型      | 默认值      | 说明                                                                   |
| ---------- | --------- | ----------- | ---------------------------------------------------------------------- |
| `children` | `JSXNode` | `undefined` | 分组内的任意元素。                                                     |
| `x` `y`    | `number`  | `0`         | 当至少有一个不为 `0` 且未设置 `transform` 时，生成 `translate(x, y)`。 |

```jsx
<Group
  x={10}
  y={10}
  width={200} // 可选，用于边界计算
  height={100} // 可选，用于边界计算
  transform="rotate(45)" // SVG transform
  opacity={0.8}>
  {children}
</Group>
```

<Note>
  Group 的 width/height
  不会约束子元素，仅用于边界计算。如果未设置，会自动根据子元素计算。
</Note>

## Rect {#rect}

`Rect` 定义矩形，等同于 SVG `<rect>` 元素。直接使用几何属性控制位置与尺寸。

```jsx
<Rect
  x={0}
  y={0}
  width={100}
  height={50}
  fill="blue"
  stroke="black"
  strokeWidth={2}
  rx={5} // 圆角半径
  ry={5} // 圆角半径（Y 方向）
  opacity={0.8}
/>
```

| 参数                     | 类型        | 默认值 | 说明                      |
| ------------------------ | ----------- | ------ | ------------------------- |
| `x` `y` `width` `height` | `number`    | -      | 矩形几何尺寸。            |
| `rx` `ry`                | `number`    | -      | 圆角半径，沿用 SVG 语义。 |
| 其他                     | `RectProps` | -      | SVG `<rect>` 属性。       |

## Ellipse {#ellipse}

`Ellipse` 定义椭圆。如果要绘制圆形，可以传入相等的宽高。

```jsx
// 椭圆
<Ellipse
  x={0} // 包围盒左上角 x（非圆心）
  y={0} // 包围盒左上角 y（非圆心）
  width={100} // 宽度
  height={60} // 高度（与 width 相等时为圆形）
  fill="red"
  stroke="black"
  strokeWidth={2}
/>
// 圆形
<Ellipse x={200} y={20} width={100} height={100} fill="#4ECB73" stroke="#1B4224" />
```

| 参数                     | 类型           | 默认值 | 说明                   |
| ------------------------ | -------------- | ------ | ---------------------- |
| `x` `y` `width` `height` | `number`       | `0`    | 包围盒几何尺寸。       |
| 其他                     | `EllipseProps` | -      | SVG `<ellipse>` 属性。 |

> `Ellipse` 的 `x` `y` 参数表示椭圆的包围盒的左上角坐标，而非椭圆的中心点坐标。

## Path {#path}

`Path` 用于定义路径，类似于 SVG 中的 `<path>` 元素。 `Path` 支持 `d` 属性，用于定义路径数据。

```jsx
<Path
  d="M 0 0 L 100 100 L 100 0 Z"
  fill="green"
  stroke="black"
  strokeWidth={2}
  width={100} // 估算宽度（用于边界计算）
  height={100} // 估算高度
  // 其他 SVG 属性...
/>
```

> Path 是信息图中最灵活的元素，它几乎能够绘制出任意的二维图形。对于一些极为复杂的元素，你也可以从设计软件中导出 SVG Path 数据，并直接使用在 `d` 属性中。

当 `x` 或 `y` 传入时，会被转换为 `transform="translate(x, y)"`，方便对路径整体偏移。

| 参数    | 类型        | 默认值      | 说明                                                                                                                             |
| ------- | ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `d`     | `string`    | 必填        | 路径数据字符串。                                                                                                                 |
| `x` `y` | `number`    | `undefined` | 若任一存在，则覆盖 `transform` 为 `translate(x, y)`。需要合并自定义变换时，可直接传入完整的 `transform` 字符串而不设置 `x`/`y`。 |
| 其他    | `PathProps` | -           | SVG `<path>` 属性。                                                                                                              |

## Polygon {#polygon}

`Polygon` 用于定义多边形，包装了 SVG `<polygon>`。

```jsx
<Polygon
  points={[
    {x: 0, y: 0},
    {x: 100, y: 0},
    {x: 50, y: 100},
  ]}
  fill="purple"
  stroke="black"
  strokeWidth={2}
/>
```

<Note>`points` 必须是**对象数组** `{(x, y)}[]`，不是字符串格式。</Note>

| 参数     | 类型                         | 默认值      | 说明                                                  |
| -------- | ---------------------------- | ----------- | ----------------------------------------------------- |
| `points` | `{ x: number; y: number }[]` | `[]`        | 点集，会自动转换为 `points="x1,y1 x2,y2 ..."`.        |
| `x` `y`  | `number`                     | `undefined` | 若任一存在，则覆盖 `transform` 为 `translate(x, y)`。 |
| 其他     | `PolygonProps`               | -           | SVG `<polygon>` 属性。                                |

## Text {#text}

`Text` 用于定义文本，类似于 SVG 中的 `<text>` 元素。`Text`
支持 `x`、`y`、`fontSize`、`fontFamily`、`fill` 等属性，用于控制文本的样式和位置。

```jsx
<Text
  x={0}
  y={0}
  width={200} // 文本容器宽度
  height={100} // 文本容器高度
  fontSize={14}
  fontWeight="bold" // 'normal' | 'bold' | number
  fontFamily="Arial"
  alignHorizontal="center" // 'left' | 'center' | 'right'
  alignVertical="middle" // 'top' | 'middle' | 'bottom'
  lineHeight={1.5} // 行高倍数
  wordWrap={true} // 启用自动换行
  fill="#000000" // 文本颜色
  backgroundColor="#ffff00" // 背景色（可选）
>
  文本内容支持换行
</Text>
```

`Text` 提供了便捷的对齐与背景能力：当设置 `backgroundColor` 且不为 `none` 时，会自动输出一个包含背景矩形与文本的 `<g>` 节点。

| 参数                                                   | 类型                            | 默认值                     | 说明                                     |
| ------------------------------------------------------ | ------------------------------- | -------------------------- | ---------------------------------------- |
| `x` `y` `width` `height`                               | `number`                        | `0`                        | 文本框几何尺寸，用于对齐计算与背景尺寸。 |
| `alignHorizontal`                                      | `'left' \| 'center' \| 'right'` | `left`                     | 水平对齐位置。                           |
| `alignVertical`                                        | `'top' \| 'middle' \| 'bottom'` | `top`                      | 垂直对齐位置。                           |
| `fontSize`                                             | `number`                        | `14`                       | 文本字号。                               |
| `fontFamily` `fontStyle` `fontWeight` `textDecoration` | `string`                        | `undefined`                | 字体样式相关属性。                       |
| `letterSpacing` `wordSpacing`                          | `number`                        | `undefined`                | 字距/词距。                              |
| `lineHeight`                                           | `number`                        | `undefined`                | 行高倍数，大于 1 时将重设基线位置。      |
| `wordWrap`                                             | `boolean`                       | `undefined`                | 是否自动换行。                           |
| `opacity` `fill`                                       | -                               | `opacity=1` `fill='black'` | 颜色与整体透明度。                       |
| `backgroundColor`                                      | `string`                        | `none`                     | 非 `none` 时输出背景矩形包裹文本。       |
| `backgroundOpacity`                                    | `number`                        | `1`                        | 背景透明度。                             |
| `backgroundRadius`                                     | `number`                        | `0`                        | 背景圆角半径。                           |
| `children`                                             | `string \| number`              | 必填                       | 文本内容。                               |
