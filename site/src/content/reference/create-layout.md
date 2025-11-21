---
title: 创建布局
---

布局组件用于在信息图中复用排版逻辑，例如横向/纵向堆叠、水平垂直对齐或网格排列。你可以用 `createLayout` 把这些排版规则封装成一个 JSX 组件，像使用普通节点一样嵌套在图形里。

## 基本思路 {#basic}

1. 定义布局：使用 `createLayout` 包裹一个函数，函数会拿到子元素列表和你的自定义属性。
2. 计算位置：通过`getElementBounds`获取子元素的包围盒，计算新的 `x`/`y`，并返回调整后的节点树。
3. 嵌套使用：在 JSX 中像普通组件一样使用你的布局，布局会在渲染前被展开。

<Note>
  关于工具函数的更多细节，请参见[工具函数](/reference/utility-functions)一章。
</Note>

```tsx
import {
  createLayout,
  cloneElement,
  getElementBounds,
  Group,
} from '@antv/infographic/jsx';

// 简单的垂直堆叠布局
export const Stack = createLayout<{gap?: number}>(
  (children, {gap = 8, ...props}) => {
    let offsetY = 0;
    const placed = children.map((child) => {
      const bounds = getElementBounds(child);
      const next = cloneElement(child, {x: 0, y: offsetY});
      offsetY += bounds.height + gap;
      return next;
    });
    // 用 Group 包一层，方便继续平移或套用样式
    return <Group {...props}>{placed}</Group>;
  }
);

// 使用
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

## 内置示例 {#built-in}

- `AlignLayout`：让一组元素在容器内左/中/右、上/中/下对齐。当未设置容器宽高时，会根据子元素尺寸自动推断。使用示例：
  ```jsx
  <AlignLayout horizontal="center" vertical="middle">
    <Rect width={120} height={60} />
    <Text width={120} height={24} alignHorizontal="center">
      居中
    </Text>
  </AlignLayout>
  ```
- `FlexLayout`：类 Flex 排版，支持 `flexDirection`、`justifyContent`、`alignItems`、`flexWrap`、`gap` 等属性，内建换行、间距和主/交叉轴对齐。容器有尺寸时按容器分布；无尺寸时根据子元素自动收拢。
  ```jsx
  <FlexLayout width={320} height={200} gap={12} justifyContent="space-between">
    <Rect width={80} height={80} />
    <Rect width={80} height={80} />
    <Rect width={80} height={80} />
  </FlexLayout>
  ```

## 实践指南 {#tips}

- 优先用 `getElementBounds`，避免手写尺寸；缺省容器大小时可用 `getElementsBounds` 自动回填。
- 如果需要组合自定义变换，可在布局里写入最终的 `transform`，或直接平移 `Group`。
- 适合将布局与主题/模板结合：把样式交给外部 props，布局只关注坐标计算，这样可重复复用同一排版逻辑。
