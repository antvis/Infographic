---
title: JSX
---

AntV Infographic 提供了一个轻量化的 JSX 渲染引擎，支持通过 JSX 语法描述图形元素，并渲染为 SVG。

## 基础用法 {#basic-usage}

在编写 AntV Infographic JSX 前，你需要在文件头部引入 `/** @jsxImportSource @antv/infographic */` 指令，以启用 JSX 转换功能：

下面的示例中通过 JSX 语法创建了一个包含矩形和文本的简单节点组件 `Node`，并使用 [renderSVG](/reference/jsx-utils#render-svg) 方法将其渲染为 SVG 字符串。

```jsx
/** @jsxImportSource @antv/infographic */

import {renderSVG, Rect, Text, Group} from '@antv/infographic';

const Node = () => (
  <Group>
    <Rect width={100} height={50} fill="blue" />
    <Text x={10} y={30} fill="white">
      Hello World
    </Text>
  </Group>
);

const svgString = renderSVG(<Node />);
console.log(svgString);
```

## 核心模块 {#core-modules}

### JSX 运行时 {#jsx-runtime}

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

### 渲染器 {#renderer}

两阶段渲染管线：

#### 1. 处理阶段 (`processElement`) {#1-处理阶段-processelement}

将 JSX 元素树转换为可渲染的元素树：

```typescript
function processElement(
  element: JSXElement,
  context: RenderContext
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

#### 2. 渲染阶段 (`render`) {#2-渲染阶段-render}

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

### 布局 {#layout}

提供 [createLayout](/reference/create-layout) 函数创建自定义布局组件。

#### 基本原理 {#基本原理}

布局组件是特殊的函数组件，使用 Symbol 标记：

```typescript
const LAYOUT_SYMBOL = Symbol('layout');

export function createLayout<T>(fn: LayoutFunction<T>): LayoutComponent<T> {
  const component = (props) => fn(props);
  component[LAYOUT_SYMBOL] = true;
  return component;
}
```

#### 创建布局 {#创建布局}

```tsx
import {createLayout, getElementBounds} from '@antv/infographic-jsx';

// 创建垂直堆叠布局
const VerticalLayout = createLayout<{gap: number}>(({children, gap = 10}) => {
  let currentY = 0;

  return children.map((child) => {
    const bounds = getElementBounds(child);
    const positioned = {
      ...child,
      props: {...child.props, y: currentY},
    };
    currentY += bounds.height + gap;
    return positioned;
  });
});
```

#### 使用布局 {#使用布局}

```tsx
<VerticalLayout gap={20}>
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
</VerticalLayout>

// 渲染结果：三个矩形垂直排列，间距 20
```

#### 布局执行流程 {#布局执行流程}

1. **渲染器识别**：检测到 layout symbol
2. **收集 children**：获取所有子元素
3. **调用布局函数**：传入 children 和 props
4. **获取新 children**：布局函数返回调整位置后的 children
5. **继续渲染**：渲染新的 children 数组

<Note>

- 布局函数可以修改 children 的位置、尺寸等属性
- 使用 `getElementBounds` 获取子元素的边界信息
- 支持嵌套布局
- 布局是在处理阶段执行的

</Note>

#### 复杂布局示例 {#复杂布局示例}

参考 `packages/infographic/src/designs/layouts/Align.tsx`：

```tsx
export const AlignLayout = createLayout<{
  horizontal?: 'left' | 'center' | 'right';
  vertical?: 'top' | 'center' | 'bottom';
  width?: number;
  height?: number;
}>(({children, horizontal, vertical, width, height}) => {
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

    return {...child, props: {...child.props, x, y}};
  });
});
```
