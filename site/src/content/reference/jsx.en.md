---
title: JSX
---

AntV Infographic ships with a lightweight JSX rendering engine that lets you describe graphical elements using JSX and render them as SVG.

## Basic Usage {#basic-usage}

At the top of your file, add the pragma `/** @jsxImportSource @antv/infographic */` to enable the JSX transform.

The snippet below defines a simple `Node` component with a rectangle and text, then uses [renderSVG](/reference/jsx-utils#render-svg) to convert it into an SVG string.

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

## Core Modules {#core-modules}

### JSX Runtime {#jsx-runtime}

The runtime exposes the functions used by the JSX compiler.

```typescript
// jsx-runtime.ts
export function jsx(type, props, key) { /* ... */ }
export function jsxs(type, props, key) { /* ... */ }
export function jsxDEV(type, props, key, ...) { /* ... */ }
export const Fragment: unique symbol;
```

Features:

- `jsx()`: Create a single JSX element.
- `jsxs()`: Create statically known JSX elements for compiler optimization.
- `jsxDEV()`: Development mode with extra debug metadata.
- `Fragment`: Supports fragments (`<>...</>`).

### Renderer {#renderer}

Rendering pipeline has two stages:

#### 1. Processing Stage (`processElement`) {#1-处理阶段-processelement}

Convert the JSX tree into a renderable element tree.

```typescript
function processElement(
  element: JSXElement,
  context: RenderContext
): ProcessedElement;
```

Responsibilities:

- Expand function components recursively.
- Handle fragments by flattening children.
- Execute layout functions (those created via `createLayout`).
- Collect bounds information.
- Produce the final render tree.

Example:

```tsx
// Input JSX
<MyComponent>
  <Rect width={100} height={50} />
</MyComponent>

// Processed output
{
  type: 'Group',
  props: { ... },
  children: [
    { type: 'Rect', props: { width: 100, height: 50 }, children: [] }
  ]
}
```

#### 2. Rendering Stage (`render`) {#2-渲染阶段-render}

Convert the processed tree into an SVG string.

```typescript
function render(element: ProcessedElement, context: RenderContext): string;
```

Tasks:

- Generate SVG tags based on element types.
- Apply attributes and styles.
- Recursively render child elements.
- Auto-compute the `viewBox`.
- Optimize output (e.g., drop redundant attributes).

Example:

```tsx
// Processed element
{ type: 'Rect', props: { width: 100, height: 50, fill: 'blue' } }

// Rendered SVG
<rect width="100" height="50" fill="blue" />
```

### Layout {#layout}

Use [createLayout](/reference/create-layout) to build custom layout components.

#### Basics {#基本原理}

Layout components are special function components marked by a symbol:

```typescript
const LAYOUT_SYMBOL = Symbol('layout');

export function createLayout<T>(fn: LayoutFunction<T>): LayoutComponent<T> {
  const component = (props) => fn(props);
  component[LAYOUT_SYMBOL] = true;
  return component;
}
```

#### Creating a Layout {#创建布局}

```tsx
import {createLayout, getElementBounds} from '@antv/infographic-jsx';

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

#### Using Layouts {#使用布局}

```tsx
<VerticalLayout gap={20}>
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
  <Rect width={100} height={50} />
</VerticalLayout>

// Result: Three rectangles stacked vertically with 20px spacing
```

#### Layout Execution Flow {#布局执行流程}

1. Renderer detects the layout symbol.
2. Collects children.
3. Executes the layout function with `children` and props.
4. Receives the position-adjusted children.
5. Continues rendering the new array.

<Note>

- Layout functions can modify positions, sizes, etc.
- Use `getElementBounds` to measure children.
- Nested layouts are supported.
- Layout runs during the processing stage.

</Note>

#### Advanced Layout Example {#复杂布局示例}

Refer to `packages/infographic/src/designs/layouts/Align.tsx`:

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

    if (horizontal === 'center') {
      x = (containerWidth - childBounds.width) / 2;
    } else if (horizontal === 'right') {
      x = containerWidth - childBounds.width;
    }

    if (vertical === 'center') {
      y = (containerHeight - childBounds.height) / 2;
    } else if (vertical === 'bottom') {
      y = containerHeight - childBounds.height;
    }

    return {...child, props: {...child.props, x, y}};
  });
});
```
