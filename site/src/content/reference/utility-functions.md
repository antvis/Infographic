---
title: 工具函数
---

AntV Infographic 提供了一些工具函数，方便在布局或自定义组件中复用几何计算与节点操作。

## cloneElement {#clone-element}

浅拷贝一个 JSX 节点并覆写部分属性，常用于布局中调整子元素的 `x`/`y` 或样式。

```ts
function cloneElement(
  element: JSXElement,
  props?: Partial<typeof element.props>
): JSXElement;
```

| 参数      | 类型                                         | 说明                                     |
| --------- | -------------------------------------------- | ---------------------------------------- |
| `element` | [`JSXElement`](/reference/types#jsx-element) | 要克隆的节点。                           |
| `props`   | `Record<string, any>`                        | 要覆盖或追加的属性，将与原有属性浅合并。 |

**返回值**：新的 [`JSXElement`](/reference/types#jsx-element)，原对象不变。

## getElementBounds {#get-element-bounds}

计算单个 JSX 节点的外接矩形。支持原语节点、布局组件、函数组件以及数组。

```ts
function getElementBounds(node?: JSXNode): Bounds;
// Bounds = { x: number; y: number; width: number; height: number }
```

| 参数   | 类型                                                  | 说明                      |
| ------ | ----------------------------------------------------- | ------------------------- |
| `node` | [`JSXNode`](/reference/types#jsx-node) \| `undefined` | 任意 JSX 节点或节点数组。 |

**返回值**：[`Bounds`](/reference/types#bounds)。若无法推导尺寸（无子元素且无显式宽高），返回 `width=0`、`height=0`。

**行为要点**

- 布局组件（由 `createLayout` 生成）会先执行布局函数再计算尺寸。
- 函数组件优先使用显式的 `width`/`height`；若缺省，则递归测量其渲染结果。
- 传入数组时会递归展开并合并子节点的包围盒。

## getElementsBounds {#get-elements-bounds}

计算一组节点的整体包围盒，内部会为每个节点调用 `getElementBounds` 后求并集。

```ts
function getElementsBounds(elements: JSXNode): Bounds;
```

| 参数       | 类型                                   | 说明                     |
| ---------- | -------------------------------------- | ------------------------ |
| `elements` | [`JSXNode`](/reference/types#jsx-node) | 一个或多个节点（数组）。 |

**返回值**：[`Bounds`](/reference/types#bounds)。若数组为空或无有效节点，返回全 0。

## getCombinedBounds {#get-combined-bounds}

纯几何工具，将多个 `Bounds` 合并为最小包围盒，不处理节点。

```ts
function getCombinedBounds(list?: Bounds[] | null): Bounds;
```

| 参数   | 类型                                                           | 说明               |
| ------ | -------------------------------------------------------------- | ------------------ |
| `list` | [`Bounds[]`](/reference/types#bounds) \| `null` \| `undefined` | 要合并的边界集合。 |

**返回值**：[`Bounds`](/reference/types#bounds)。传入空值时返回全 0。

## 典型场景 {#usage}

- 自定义布局：用 `getElementBounds` 获取子节点尺寸，`cloneElement` 写入新的 `x`/`y`。
- 组件自动撑开：缺省宽高时，用 `getElementsBounds` 得到子内容的整体尺寸并回填自身 `width`/`height`。
- 组合计算：已有预计算的 `Bounds` 列表时，用 `getCombinedBounds` 合并，避免重复遍历节点树。
