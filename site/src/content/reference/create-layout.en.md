---
title: Create Layout
---

Layout components are used to reuse layout logic in infographics, such as horizontal/vertical stacking, horizontal/vertical alignment, or grid arrangement. You can use `createLayout` to encapsulate these layout rules into a JSX component and nest it in graphics just like using regular nodes.

## Basic Concept {#basic}

1. Define layout: Use `createLayout` to wrap a function that receives a list of child elements and your custom properties.
2. Calculate positions: Get the bounding box of child elements through `getElementBounds`, calculate new `x`/`y`, and return the adjusted node tree.
3. Nested usage: Use your layout like a regular component in JSX, and the layout will be expanded before rendering.

<Note>
  For more details about utility functions, please refer to the [Utility Functions](/reference/jsx-utils) chapter.
</Note>

```tsx
import {
  createLayout,
  cloneElement,
  getElementBounds,
  Group,
} from '@antv/infographic/jsx';

// Simple vertical stacking layout
export const Stack = createLayout<{gap?: number}>(
  (children, {gap = 8, ...props}) => {
    let offsetY = 0;
    const placed = children.map((child) => {
      const bounds = getElementBounds(child);
      const next = cloneElement(child, {x: 0, y: offsetY});
      offsetY += bounds.height + gap;
      return next;
    });
    // Wrap with Group for easier translation or style application
    return <Group {...props}>{placed}</Group>;
  }
);

// Usage
const Card = () => (
  <Stack x={20} y={20} gap={12}>
    <Rect width={200} height={80} fill="#EEF3FF" rx={12} />
    <Text width={200} height={24}>
      Title
    </Text>
    <Text width={200} height={40} alignVertical="middle">
      Description
    </Text>
  </Stack>
);
```

## Built-in Examples {#built-in}

- `AlignLayout`: Aligns a group of elements left/center/right, top/middle/bottom within a container. When container width and height are not set, it will automatically infer from child element sizes. Usage example:
  ```jsx
  <AlignLayout horizontal="center" vertical="middle">
    <Rect width={120} height={60} />
    <Text width={120} height={24} alignHorizontal="center">
      Centered
    </Text>
  </AlignLayout>
  ```
- `FlexLayout`: Flex-like layout, supports `flexDirection`, `justifyContent`, `alignItems`, `flexWrap`, `gap` and other properties, with built-in wrapping, spacing, and main/cross axis alignment. When the container has a size, it distributes according to the container; when it has no size, it automatically shrinks according to child elements.
  ```jsx
  <FlexLayout width={320} height={200} gap={12} justifyContent="space-between">
    <Rect width={80} height={80} />
    <Rect width={80} height={80} />
    <Rect width={80} height={80} />
  </FlexLayout>
  ```

## Practice Guide {#tips}

- Prioritize using `getElementBounds`, avoid manually writing sizes; when the default container size is missing, you can use `getElementsBounds` to automatically backfill.
- If you need to combine custom transformations, you can write the final `transform` in the layout, or directly translate the `Group`.
- Suitable for combining layouts with themes/templates: pass styles to external props, and the layout only focuses on coordinate calculations, so the same layout logic can be reused repeatedly.
