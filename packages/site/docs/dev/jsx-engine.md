# JSX 引擎详解

@antv/infographic-jsx 是一个轻量级的 JSX 运行时引擎，为 Infographic 框架提供底层渲染能力。

## 快速开始

### 基础用法

在 TypeScript 文件中使用 JSX 引擎：

```tsx
/** @jsxImportSource @antv/infographic-jsx */
import { renderSVG, Rect, Text, Group } from '@antv/infographic-jsx';

const MyGraphic = () => (
  <Group>
    <Rect width={100} height={50} fill="blue" />
    <Text x={10} y={30} fill="white">
      Hello World
    </Text>
  </Group>
);

const svgString = renderSVG(<MyGraphic />);
console.log(svgString);
```

::: warning 重要
每个使用 JSX 的文件都必须在**首行**添加 `/** @jsxImportSource @antv/infographic-jsx */` 注释。
:::

## 项目结构

```
packages/jsx/src/
├── components/         # 原语节点组件
│   ├── Rect.ts        # 矩形
│   ├── Ellipse.ts     # 椭圆/圆形
│   ├── Text.ts        # 文本（支持对齐、换行）
│   ├── Group.ts       # 分组容器
│   ├── Path.ts        # 路径
│   ├── Polygon.ts     # 多边形
│   └── Defs.ts        # SVG 定义
├── types/             # 类型定义
│   ├── jsx.ts         # JSX 元素类型
│   ├── element.ts     # SVG 元素属性
│   ├── context.ts     # 渲染上下文
│   ├── bounds.ts      # 边界计算类型
│   └── point.ts       # 点几何类型
├── utils/             # 工具函数（10+ 模块）
│   ├── bounds.ts      # 边界计算
│   ├── context.ts     # 上下文管理
│   ├── svg.ts         # SVG 渲染辅助
│   ├── element.ts     # 元素操作
│   └── ...
├── jsx-runtime.ts     # JSX 运行时实现
├── renderer.ts        # SVG 渲染引擎
├── layout.ts          # 布局系统
└── index.ts           # 主导出
```

## 核心模块

### JSX Runtime

实现 JSX 转换函数：

```typescript
// jsx-runtime.ts
export function jsx(type, props, key) { /* ... */ }
export function jsxs(type, props, key) { /* ... */ }
export function jsxDEV(type, props, key, ...) { /* ... */ }
export const Fragment: unique symbol;
```

**功能**：

- `jsx()`：创建单个 JSX 元素
- `jsxs()`：创建静态 JSX 元素（编译优化）
- `jsxDEV()`：开发模式（包含更多调试信息）
- `Fragment`：片段支持 `<>...</>`

### Renderer

两阶段渲染管线：

#### 1. 处理阶段 (`processElement`)

将 JSX 元素树转换为可渲染的元素树：

```typescript
function processElement(
  element: JSXElement,
  context: RenderContext,
): ProcessedElement;
```

**主要工作**：

- 展开函数组件（递归调用函数）
- 处理 Fragment（扁平化子元素）
- 执行布局计算（调用 layout 函数）
- 收集边界信息
- 生成渲染树

**示例**：

```tsx
// 输入 JSX
<MyComponent>
  <Rect width={100} height={50} />
</MyComponent>

// 处理后
{
  type: 'Group',
  props: { ... },
  children: [
    { type: 'Rect', props: { width: 100, height: 50 }, children: [] }
  ]
}
```

#### 2. 渲染阶段 (`render`)

将处理后的元素树转换为 SVG 字符串：

```typescript
function render(element: ProcessedElement, context: RenderContext): string;
```

**主要工作**：

- 根据元素类型生成对应的 SVG 标签
- 应用属性和样式
- 递归渲染子元素
- 自动计算 viewBox
- 优化输出（去除冗余属性等）

**示例**：

```tsx
// 输入处理后的元素
{ type: 'Rect', props: { width: 100, height: 50, fill: 'blue' } }

// 输出 SVG
<rect width="100" height="50" fill="blue" />
```

### Layout System

提供 `createLayout()` 函数创建自定义布局组件。

#### 基本原理

布局组件是特殊的函数组件，使用 Symbol 标记：

```typescript
const LAYOUT_SYMBOL = Symbol('layout');

export function createLayout<T>(fn: LayoutFunction<T>): LayoutComponent<T> {
  const component = (props) => fn(props);
  component[LAYOUT_SYMBOL] = true;
  return component;
}
```

#### 创建布局

```tsx
import { createLayout, getElementBounds } from '@antv/infographic-jsx';

// 创建垂直堆叠布局
const VerticalLayout = createLayout<{ gap: number }>(
  ({ children, gap = 10 }) => {
    let currentY = 0;

    return children.map((child) => {
      const bounds = getElementBounds(child);
      const positioned = {
        ...child,
        props: { ...child.props, y: currentY },
      };
      currentY += bounds.height + gap;
      return positioned;
    });
  },
);
```

#### 使用布局

```tsx
<VerticalLayout gap={20}>
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
</VerticalLayout>

// 渲染结果：三个矩形垂直排列，间距 20
```

#### 布局执行流程

1. **渲染器识别**：检测到 layout symbol
2. **收集 children**：获取所有子元素
3. **调用布局函数**：传入 children 和 props
4. **获取新 children**：布局函数返回调整位置后的 children
5. **继续渲染**：渲染新的 children 数组

::: tip 关键点

- 布局函数可以修改 children 的位置、尺寸等属性
- 使用 `getElementBounds` 获取子元素的边界信息
- 支持嵌套布局
- 布局是在处理阶段执行的
  :::

#### 复杂布局示例

参考 `packages/infographic/src/designs/layouts/Align.tsx`：

```tsx
export const AlignLayout = createLayout<{
  horizontal?: 'left' | 'center' | 'right';
  vertical?: 'top' | 'center' | 'bottom';
  width?: number;
  height?: number;
}>(({ children, horizontal, vertical, width, height }) => {
  const bounds = getElementsBounds(children);
  const containerWidth = width ?? bounds.width;
  const containerHeight = height ?? bounds.height;

  return children.map((child) => {
    const childBounds = getElementBounds(child);
    let x = child.props.x ?? 0;
    let y = child.props.y ?? 0;

    // 水平对齐
    if (horizontal === 'center') {
      x = (containerWidth - childBounds.width) / 2;
    } else if (horizontal === 'right') {
      x = containerWidth - childBounds.width;
    }

    // 垂直对齐
    if (vertical === 'center') {
      y = (containerHeight - childBounds.height) / 2;
    } else if (vertical === 'bottom') {
      y = containerHeight - childBounds.height;
    }

    return { ...child, props: { ...child.props, x, y } };
  });
});
```

## 原语节点

所有原语节点统一使用 `x`, `y`, `width`, `height` 定位，**不使用** SVG 原生的 `cx/cy/r/rx/ry` 等属性。

### Rect - 矩形

```tsx
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

### Ellipse - 椭圆/圆形

```tsx
<Ellipse
  x={0} // 包围盒左上角 x（非圆心）
  y={0} // 包围盒左上角 y（非圆心）
  width={100} // 宽度
  height={60} // 高度（与 width 相等时为圆形）
  fill="red"
  stroke="black"
  strokeWidth={2}
/>
```

::: warning 注意
`x`, `y` 为包围盒左上角位置，**不是**圆心坐标。如需获取圆心：

```typescript
const centerX = x + width / 2;
const centerY = y + height / 2;
```

:::

### Text - 文本

```tsx
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

**特性**：

- ✅ 自动换行（`wordWrap={true}`）
- ✅ 水平和垂直对齐
- ✅ 可选背景色
- ✅ 行高控制
- ✅ 文本内容作为 children 传入

**示例**：

```tsx
// 居中文本
<Text
  x={50}
  y={50}
  width={200}
  height={100}
  alignHorizontal="center"
  alignVertical="middle"
  fontSize={16}
>
  居中显示的文本
</Text>

// 多行文本
<Text
  x={0}
  y={0}
  width={300}
  wordWrap={true}
  lineHeight={1.6}
>
  这是一段很长的文本，会自动换行显示。
  支持多行内容展示。
</Text>
```

### Group - 分组

```tsx
<Group
  x={10}
  y={10}
  width={200} // 可选，用于边界计算
  height={100} // 可选，用于边界计算
  transform="rotate(45)" // SVG transform
  opacity={0.8}
>
  {children}
</Group>
```

**作用**：

- 组织子元素
- 应用统一变换（transform）
- 边界计算容器

::: tip
Group 的 width/height 不会约束子元素，仅用于边界计算。如果未设置，会自动根据子元素计算。
:::

### Path - 路径

```tsx
<Path
  d="M 0 0 L 100 100 L 100 0 Z"
  fill="green"
  stroke="black"
  strokeWidth={2}
  width={100} // 估算宽度（用于边界计算）
  height={100} // 估算高度
  // ...
/>
```

### Polygon - 多边形

```tsx
<Polygon
  points={[
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 50, y: 100 },
  ]}
  fill="purple"
  stroke="black"
  strokeWidth={2}
/>
```

::: warning 重要
`points` 必须是**对象数组** `{x, y}[]`，不是字符串格式。
:::

**示例**：

```tsx
// 五角星
const starPoints = [
  { x: 50, y: 0 },
  { x: 61, y: 35 },
  { x: 98, y: 35 },
  { x: 68, y: 57 },
  { x: 79, y: 91 },
  { x: 50, y: 70 },
  { x: 21, y: 91 },
  { x: 32, y: 57 },
  { x: 2, y: 35 },
  { x: 39, y: 35 },
];

<Polygon points={starPoints} fill="gold" />;
```

### Defs - SVG 定义

用于定义渐变、滤镜、图案等可复用元素。

```tsx
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

::: tip
在 `<Defs>` 内可以使用原生 SVG 元素（小写标签）。
:::

## 工具函数

### getElementBounds

获取单个元素的边界信息：

```typescript
import { getElementBounds } from '@antv/infographic-jsx';

const bounds = getElementBounds(<Rect width={100} height={50} />);
// 返回: { x: 0, y: 0, width: 100, height: 50 }

const textBounds = getElementBounds(
  <Text fontSize={14}>Hello World</Text>
);
// 返回: { x: 0, y: 0, width: 计算宽度, height: 计算高度 }
```

### getElementsBounds

获取多个元素的组合边界：

```typescript
import { getElementsBounds } from '@antv/infographic-jsx';

const bounds = getElementsBounds([
  <Rect x={0} y={0} width={100} height={50} />,
  <Rect x={50} y={50} width={100} height={50} />
]);
// 返回: { x: 0, y: 0, width: 150, height: 100 }
```

### getCombinedBounds

合并多个边界对象：

```typescript
import { getCombinedBounds } from '@antv/infographic-jsx';

const combined = getCombinedBounds([
  { x: 0, y: 0, width: 100, height: 50 },
  { x: 50, y: 50, width: 100, height: 50 },
]);
// 返回: { x: 0, y: 0, width: 150, height: 100 }
```

### cloneElement

克隆 JSX 元素并覆盖 props：

```typescript
import { cloneElement } from '@antv/infographic-jsx';

const original = <Rect width={100} height={50} fill="blue" />;
const cloned = cloneElement(original, { fill: 'red', x: 10 });
// cloned 的 fill 为 'red'，x 为 10，其他属性保持不变
```

### renderSVG

渲染 JSX 元素为 SVG 字符串：

```typescript
import { renderSVG } from '@antv/infographic-jsx';

// 基础用法
const svg = renderSVG(<MyComponent />);

// 自定义 SVG 属性
const svg = renderSVG(<MyComponent />, {
  width: 200,
  height: 200,
  viewBox: '0 0 200 200',
  xmlns: 'http://www.w3.org/2000/svg'
});
```

## 高级用法

### 自定义组件

创建可复用的函数组件：

```tsx
interface ButtonProps {
  x?: number;
  y?: number;
  width: number;
  height: number;
  label: string;
  color?: string;
  onClick?: () => void;
}

const Button = ({
  x = 0,
  y = 0,
  width,
  height,
  label,
  color = 'blue',
}: ButtonProps) => (
  <Group x={x} y={y}>
    <Rect width={width} height={height} fill={color} rx={4} />
    <Text
      x={width / 2}
      y={height / 2}
      alignHorizontal="center"
      alignVertical="middle"
      fill="white"
      fontWeight="bold"
    >
      {label}
    </Text>
  </Group>
);

// 使用
<Group>
  <Button x={10} y={10} width={80} height={30} label="确定" />
  <Button x={100} y={10} width={80} height={30} label="取消" color="gray" />
</Group>;
```

### Fragment

使用 Fragment 组合元素而不添加额外容器：

```tsx
const MultipleShapes = () => (
  <>
    <Rect width={50} height={50} fill="red" />
    <Ellipse x={60} width={50} height={50} fill="blue" />
    <Text x={120} y={25}>
      Label
    </Text>
  </>
);
```

### 条件渲染

```tsx
const Card = ({ showIcon, title }) => (
  <Group>
    {showIcon && <Ellipse x={10} y={10} width={30} height={30} fill="blue" />}
    <Text x={showIcon ? 50 : 10} y={20}>
      {title}
    </Text>
  </Group>
);
```

### 列表渲染

```tsx
const List = ({ items }) => (
  <Group>
    {items.map((item, index) => (
      <Rect
        key={index}
        y={index * 60}
        width={200}
        height={50}
        fill="lightblue"
      />
    ))}
  </Group>
);
```

## 调试技巧

### 1. 查看生成的 SVG

```typescript
const svg = renderSVG(<MyComponent />);
console.log(svg);
// 复制到 HTML 文件或 SVG 编辑器中查看
```

### 2. 边界可视化

```tsx
const DebugBounds = ({ element }) => {
  const bounds = getElementBounds(element);

  return (
    <>
      {element}
      <Rect
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
        fill="none"
        stroke="red"
        strokeWidth={1}
        strokeDasharray="5,5"
      />
    </>
  );
};
```

### 3. 日志输出

```tsx
const LoggingComponent = (props) => {
  console.log('Props:', props);
  const bounds = getElementBounds(<MyInnerComponent {...props} />);
  console.log('Bounds:', bounds);

  return <MyInnerComponent {...props} />;
};
```

## 常见问题

### Q: 为什么 Ellipse 使用 x/y 而不是 cx/cy？

A: 为了统一所有组件的定位方式，所有组件都使用 `x, y, width, height`。内部会自动转换为 SVG 的原生属性。

### Q: 如何绘制圆形？

A: 使用 Ellipse，将 width 和 height 设置为相同值：

```tsx
<Ellipse x={0} y={0} width={50} height={50} fill="red" />
```

### Q: Text 组件支持富文本吗？

A: 不直接支持。需要使用多个 Text 组件或 SVG 的 `<tspan>` 元素。

### Q: 如何实现动画？

A: JSX 引擎生成静态 SVG。如需动画，可以：

1. 在 DOM 中使用 CSS 动画
2. 使用 SVG 的 `<animate>` 元素
3. 使用 JavaScript 动画库

### Q: 能否在浏览器中直接使用？

A: 可以，但需要构建工具（如 Vite、Webpack）编译 JSX。或者使用预编译的版本。

## 下一步

- [设计资产开发](./design-assets.md) - 学习如何基于 JSX 引擎开发信息图组件
- [框架内部原理](./framework-internals.md) - 了解 Infographic 如何使用 JSX 引擎
